import { CommandGroup } from '../../util/types';
import { ApplicationCommandType, ChatInputCommandInteraction } from 'discord.js';
import { NotImplementedEmbed } from '../../components/embeds';

import { revalidate } from '../../functions/root/revalidate';
import { config } from '../../functions/root/config';

const rootCommandGroup: CommandGroup<ChatInputCommandInteraction, false> = {
    global: false,
    data: {
        name: 'root',
        description: 'Tag related commands',
        type: ApplicationCommandType.ChatInput,
        options: [ revalidate.data, config.data ],
    },
    subcommands: { revalidate, config },
    async execute(interaction, client) {
        type Subcommands = keyof typeof rootCommandGroup.subcommands;
        const subcommand = interaction.options.getSubcommand() as Subcommands;
        switch (subcommand) {
            case 'revalidate': {
                await revalidate.execute(interaction, client);
                break;
            }
            case 'config': {
                await config.execute(interaction, client);
                break;
            }
            default: {
                console.warn(`[ ${ subcommand } ] - 🛠️ Under Consturction / Not implemented yet`);
                await interaction.reply({ embeds: [ NotImplementedEmbed(subcommand) ], ephemeral: true });
                return;
            }
        }
    },
    async autocomplete(interaction, client) {
        type Subcommands = keyof typeof rootCommandGroup.subcommands;
        const subcommand = interaction.options.getSubcommand() as Subcommands;
        switch (subcommand) {
            default: {
                console.warn(`[ ${ subcommand } ] - 🛠️ Under Consturction / Not implemented yet`);
                await interaction.respond([ { name: '🛠️ Under Consturction / Not implemented yet', value: 'NotImplemented' } ]);
                return;
            }
        }
    },
};

export default rootCommandGroup;
