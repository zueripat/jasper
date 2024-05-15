import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { TagEmbed, TagNotFoundEmbed } from '../../components/embeds';

export const inspectTag: Subcommand<ChatInputCommandInteraction> = {
    data: {
        name: 'inspect',
        description: 'Inspect a tag and verify it\'s schema',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'tag-name',
                description: 'The name / title of the tag you want to inpect',
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
            include: { embed: true },
        });

        if (!tag || !tag.embed) {
            await interaction.reply({ embeds: [ TagNotFoundEmbed(tagName) ], ephemeral: true });
            return;
        }

        await interaction.reply({ embeds: [ TagEmbed(tag) ], ephemeral: true });
        return;
    },
    async autocomplete(interaction, client) {
        const focused = interaction.options.getFocused();
        const tags = await client.prisma.tag.findMany({
            where: { guild_id: interaction.guild?.id },
        });

        const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(focused.toLowerCase()));
        await interaction.respond(filteredTags.map(tag => ({name: tag.name, value: tag.name })));
        return;
    },
};
