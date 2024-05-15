import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { OperationSuccessfull, TagNotFoundEmbed } from '../../components/embeds';

export const deleteTag: Subcommand<ChatInputCommandInteraction> = {
    data: {
        name: 'delete',
        description: 'Delete an existing tag',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'tag-name',
                description: 'The name of the tag you want to delete',
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true,
            },
        ],
    },
    async execute(interaction, client) {
        const tagName = interaction.options.getString('tag-name', true);

        const tag = await client.prisma.tag.findUnique({
            where: { tag_id: { name: tagName, guild_id: interaction.guild?.id! } },
        });

        if (!tag) {
            await interaction.reply({ embeds: [TagNotFoundEmbed(tagName)], ephemeral: true });
            return;
        }

        await client.prisma.tag.delete({
            where: { tag_id: { name: tagName, guild_id: interaction.guild?.id! } },
        });

        await interaction.reply({ embeds: [OperationSuccessfull(`Tag \`${tagName}\` deleted successfully.`)], ephemeral: true });
    },
    async autocomplete(interaction, client) {
        const focused = interaction.options.getFocused();
        const tags = await client.prisma.tag.findMany({
            where: { guild_id: interaction.guild?.id },
        });

        const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(focused.toLowerCase()));
        await interaction.respond(filteredTags.map(tag => ({ name: tag.name, value: tag.name })));
        return;
    }
};
