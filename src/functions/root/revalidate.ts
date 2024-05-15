import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { OperationSuccessfull } from '../../components/embeds';

export const revalidate: Subcommand<ChatInputCommandInteraction> = {
    data: {
        name: 'revalidate',
        description: 'Revalidate the cache',
        type: ApplicationCommandOptionType.Subcommand
    },
    async execute(interaction, client) {
        await client.cache.revalidateGuilds();
        await interaction.reply({ embeds: [OperationSuccessfull('Cache revalidated successfully.')], ephemeral: true });
    }
}
