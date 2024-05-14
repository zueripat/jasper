import { Client, ClientEvents, Collection, REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';
import { resolve } from 'node:path';

import { logger } from './logging.js';
import { Command, CommandInteraction, Event } from './types.js';
import { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_DEV_GUILD_ID } from './config.js';
import { PrismaClient } from '@prisma/client';

const log = logger.child({ name: 'client', type: 'discord' });

export class Bot extends Client {
    public readonly prisma = new PrismaClient();
    private readonly clientID = DISCORD_CLIENT_ID!;
    private readonly devGuilds = DISCORD_DEV_GUILD_ID ? [DISCORD_DEV_GUILD_ID] : [];

    private commands = new Collection<string, Command<CommandInteraction, boolean>>();

    private async init(): Promise<void> {
        log.info('Initializing Discord Client');

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

                log.info(`Successfully reloaded ${guildCommands.size} guild (/) commands for guild ${guildID}`);
            } catch (error) {
                log.error(`Failed to reload guild (/) commands for guild ${guildID}`);
                log.error(error);
            }
        }

        try {
            await rest.put(Routes.applicationCommands(this.clientID), {
                body: globalCommands.map((command) => command.data),
            });

            log.info(`Successfully reloaded ${globalCommands.size} global (/) commands.`);
        } catch (error) {
            log.error('Failed to reload global (/) commands.');
            log.error(error);
        }
    }

    private async loadCommands(): Promise<void> {
        const commandFiles = await readdir(resolve(__dirname, '../events/interactions'));
        const commandImports = commandFiles
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
            .map((file) => {
                const filePath = resolve(__dirname, '../events/interactions', file);
                const moduleUrl = new URL(`file://${filePath}`).href;

                return import(moduleUrl) as Promise<{
                    default: Command<CommandInteraction, boolean>;
                }>;
            });

        const commands = await Promise.all(commandImports);
        for (const command of commands) {
            log.info(`Loading command ${command.default.data.name}`);
            this.commands.set(command.default.data.name, command.default);
        }

        this.on('interactionCreate', async (interaction) => {
            switch (true) {
                case interaction.isChatInputCommand() || interaction.isContextMenuCommand(): {
                    const applicationCommand = this.commands.get(interaction.commandName);

                    if (applicationCommand && applicationCommand.data) {
                        await applicationCommand.execute(interaction, this.prisma);
                    }
                    break;
                }
                case interaction.isAutocomplete(): {
                    const autocompleteCommand = this.commands.get(interaction.commandName);
                    if (autocompleteCommand && autocompleteCommand.data && autocompleteCommand.autocomplete) {
                        await autocompleteCommand.autocomplete(interaction, this.prisma);
                    }
                    break;
                }
                case interaction.isModalSubmit(): {
                    if (
                        interaction.customId &&
                        this.commands.some((command) => command.custom_ids && command.custom_ids.includes(interaction.customId))
                    ) {
                        const command = this.commands.find((command) => command.custom_ids?.includes(interaction.customId));

                        if (command && command.modal_submit) {
                            await command.modal_submit(interaction, this.prisma);
                        }
                    }
                    break;
                }
            }
        });
    }

    private async loadEvents(): Promise<void> {
        const eventFiles = await readdir(resolve(__dirname, '../events'));
        const eventImports = eventFiles
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
            .map((file) => {
                const filePath = resolve(__dirname, '../events', file);
                const moduleUrl = new URL(`file://${filePath}`).href;

                return import(moduleUrl) as Promise<{
                    default: Event<keyof ClientEvents>;
                }>;
            });

        const events = await Promise.all(eventImports);
        for (const event of events) {
            log.info(`Loading event ${event.default.name}`);
            if (event.default.once) {
                this.once(event.default.name, (...args) => event.default.execute(this.prisma, ...args));
            } else {
                this.on(event.default.name, (...args) => event.default.execute(this.prisma, ...args));
            }
        }
    }

    public async login(): Promise<string> {
        await this.init();
        return super.login(DISCORD_BOT_TOKEN);
    }
}
