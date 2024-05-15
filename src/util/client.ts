import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
    Collection,
    ContextMenuCommandInteraction,
    REST,
    Routes,
} from 'discord.js';
import { readdir } from 'fs/promises';
import { resolve } from 'node:path';
import Cache from './cache';

import { logger } from './logging.js';
import { CommandGroup, CommandInteraction, Event, StandaloneCommand } from './types.js';
import { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_DEV_GUILD_ID } from './config.js';
import { PrismaClient } from '@prisma/client';

const log = logger.child({ name: 'client', type: 'discord' });

export class Bot extends Client {
    public readonly prisma = new PrismaClient();
    public readonly cache = new Cache(this.prisma);

    private readonly clientID = DISCORD_CLIENT_ID!;
    private readonly devGuilds = DISCORD_DEV_GUILD_ID ? [ DISCORD_DEV_GUILD_ID ] : [];

    private commands = new Collection<string, StandaloneCommand<CommandInteraction, false> | CommandGroup<CommandInteraction, false>>();

    private async init(): Promise<void> {
        log.info('Initializing Discord Client');

        // Checking Database connection
        try {
            await this.prisma.$connect();
            log.info('Database connection established successfully.');
        } catch (error) {
            log.error('Failed to connect to the database:', error);
            process.exit(1);
        } finally {
            await this.prisma.$disconnect();
        }

        await this.loadCommands();
        await this.loadEvents();

        const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN!);

        log.info('Started refreshing application (/) commands.');
        const globalCommands = this.commands.filter((command) => command.global);
        const guildCommands = this.commands.filter((command) => !command.global);

        for (const guildID of this.devGuilds) {
            try {
                await rest.put(Routes.applicationGuildCommands(this.clientID, guildID), {
                    body: guildCommands.map((command) => command.data),
                });

                log.info(`Successfully reloaded guild (/) commands for guild ${ guildID }`);
            } catch (error) {
                log.error(`Failed to reload guild (/) commands for guild ${ guildID }`);
                log.error(error);
            }
        }

        try {
            await rest.put(Routes.applicationCommands(this.clientID), {
                body: globalCommands.map((command) => command.data),
            });

            log.info(`Successfully reloaded global (/) commands.`);
        } catch (error) {
            log.error('Failed to reload global (/) commands.');
            log.error(error);
        }
    }

    private async loadCommands(): Promise<void> {
        try {
            const commandFiles = await readdir(resolve(__dirname, '../events/interactions'));
            const commandImports = commandFiles
                .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
                .map((file) => {
                    const filePath = resolve(__dirname, '../events/interactions', file);
                    return import(filePath) as Promise<{
                        default: StandaloneCommand<CommandInteraction, false> | CommandGroup<CommandInteraction, false>;
                    }>;
                });

            const commands = await Promise.all(commandImports);
            for (const command of commands) {
                if ('subcommands' in command.default) {
                    log.info(`Loading command group: ${command.default.data.name} with ${Object.keys(command.default.subcommands).length} subcommands`);
                    for (const [subcommandName] of Object.entries(command.default.subcommands)) {
                        log.info(`[>] Subcommand: ${subcommandName}`);
                    }
                } else {
                    log.info(`Loading standalone command: ${command.default.data.name}`);
                }
                this.commands.set(command.default.data.name, command.default);
            }
        } catch (e) { log.error(e); }

        this.on('interactionCreate', async (interaction) => {
            switch (true) {
                case interaction.isChatInputCommand(): {
                    const command = this.commands.get(interaction.commandName);
                    if (command && command.data) {
                        if ('subcommands' in command) {
                            const subcommandName = (interaction as ChatInputCommandInteraction).options.getSubcommand(false);
                            if (subcommandName && subcommandName in command.subcommands) {
                                const subcommand = command.subcommands[subcommandName];
                                await subcommand.execute(interaction as ChatInputCommandInteraction, this);
                            }
                        } else {
                            await command.execute(interaction as ChatInputCommandInteraction, this);
                        }
                    }
                    break;
                }
                case interaction.isContextMenuCommand(): {
                    const applicationCommand = this.commands.get(interaction.commandName) as StandaloneCommand<ContextMenuCommandInteraction, false>;
                    if (applicationCommand) {
                        await applicationCommand.execute(interaction as ContextMenuCommandInteraction, this);
                    }
                    break;
                }
                case interaction.isAutocomplete(): {
                    const applicationCommand = this.commands.get(interaction.commandName) as CommandGroup<ChatInputCommandInteraction, false>;
                    if (applicationCommand) {
                        const subcommandName = (interaction as AutocompleteInteraction).options.getSubcommand(false);
                        if (subcommandName && subcommandName in applicationCommand.subcommands) {
                            const subcommand = applicationCommand.subcommands[subcommandName];
                            if (subcommand.autocomplete) {
                                await subcommand.autocomplete(interaction, this);
                            }
                        } else if (applicationCommand.autocomplete) {
                            await applicationCommand.autocomplete(interaction, this);
                        }
                    }
                    break;
                }
                case interaction.isModalSubmit(): {
                    const customId = interaction.customId;
                    const userId = customId.split('_').pop();
                    const commandPrefix = customId.substring(0, customId.lastIndexOf('_'));

                    const command = [...this.commands.values()].find((cmd) =>
                        'custom_ids' in cmd && cmd.custom_ids && cmd.custom_ids.some(id => customId.startsWith(id))
                    );

                    if (command && 'subcommands' in command) {
                        for (const subcommand of Object.values(command.subcommands)) {
                            if (subcommand.custom_ids?.includes(commandPrefix) && subcommand.modal_submit) {
                                if (userId === interaction.user.id) {
                                    await subcommand.modal_submit(interaction, this);
                                } else {
                                    await interaction.reply({ content: "You do not have permission to submit this modal.", ephemeral: true });
                                }
                            }
                        }
                    }
                    /*
                    const commands = this.commands.filter((command) => command.custom_ids?.includes(customId));
                    for (const command of commands.values()) {
                        if ('subcommands' in command) {
                            for (const subcommand of Object.values(command.subcommands)) {
                                if (subcommand.custom_ids?.includes(customId) && subcommand.modal_submit) {
                                    await subcommand.modal_submit(interaction, this);
                                }
                            }
                        } else if (command.custom_ids?.includes(customId) && command.modal_submit) {
                            await command.modal_submit(interaction, this);
                        }
                    }

                     */
                    break;
                }
                default: {
                    log.warn(`Unhandled interaction type: ${interaction.type}`);
                    break;
                }
            }
        });
    }

    private async loadEvents(): Promise<void> {
        try {
            const eventFiles = await readdir(resolve(__dirname, '../events'));
            const eventImports = eventFiles
                .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
                .map((file) => {
                    const filePath = resolve(__dirname, '../events', file);
                    return import(filePath) as Promise<{
                        default: Event<keyof ClientEvents>;
                    }>;
                });

            const events = await Promise.all(eventImports);
            for (const event of events) {
                log.info(`Loading event ${ event.default.name }`);
                if (event.default.once) {
                    this.once(event.default.name, (...args) => event.default.execute(this, ...args));
                } else {
                    this.on(event.default.name, (...args) => event.default.execute(this, ...args));
                }
            }
        } catch (e) { log.error(e); }
    }

    public async login(): Promise<string> {
        await this.init();
        return super.login(DISCORD_BOT_TOKEN);
    }
}
