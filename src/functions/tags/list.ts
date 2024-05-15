import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { OperationFailed } from '../../components/embeds';

export const listTags: Subcommand<ChatInputCommandInteraction> = {
    data: {
        name: 'list',
        description: 'List all available tags',
        type: ApplicationCommandOptionType.Subcommand,
    },
    async execute(interaction, client) {
        const tags = await client.prisma.tag.findMany({
            where: { guild_id: interaction.guild?.id },
            select: { name: true },
        });

        if (tags.length === 0) {
            await interaction.reply({ embeds: [OperationFailed('No tags found.')], ephemeral: true });
            return;
        }

        const tagList = tags.map(tag => tag.name).join('\n');
        await interaction.reply({ content: `**Available Tags:**\n${tagList}`, ephemeral: true });
    },
};
