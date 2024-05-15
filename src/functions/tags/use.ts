// src/functions/tags/use.ts
import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { TagNotFoundEmbed, TagEmbed } from '../../components/embeds';

export const useTag: Subcommand<ChatInputCommandInteraction> = {
    data: {
        name: 'use',
        description: 'Display a tag',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'tag-name',
                description: 'The name of the tag you want to display',
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true,
            },
            {
                name: 'mention',
                description: 'Mention a user with the tag',
                type: ApplicationCommandOptionType.User,
                required: false,
            },
        ],
    },
    async execute(interaction, client) {
        const tagName = interaction.options.getString('tag-name', true);
        const mention = interaction.options.getUser('mention');

        const tag = await client.prisma.tag.findUnique({
            where: { tag_id: { name: tagName, guild_id: interaction.guild?.id! } },
            include: { embed: true },
        });

        if (!tag || !tag.embed) {
            await interaction.reply({ embeds: [TagNotFoundEmbed(tagName)], ephemeral: true });
            return;
        }

        const replyContent = mention ? `${mention}` : '';
        await interaction.reply({ content: replyContent, embeds: [TagEmbed(tag)], ephemeral: !mention });
    },
    async autocomplete(interaction, client) {
        const focused = interaction.options.getFocused();
        const tags = await client.prisma.tag.findMany({
            where: { guild_id: interaction.guild?.id },
        });

        const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(focused.toLowerCase()));
        await interaction.respond(filteredTags.map(tag => ({ name: tag.name, value: tag.name })));
        return;
    },
};
