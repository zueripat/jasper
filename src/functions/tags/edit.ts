// src/functions/tags/edit.ts
import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, ModalBuilder } from 'discord.js';
import { OperationSuccessfull, TagEmbed, TagNotFoundEmbed } from '../../components/embeds';
import { TagModal } from '../../components/modals';

export const editTag: Subcommand<ChatInputCommandInteraction> = {
    custom_ids: ['tag_edit'],
    data: {
        name: 'edit',
        description: 'Edit an existing tag',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'tag-name',
                description: 'The name of the tag you want to edit',
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

        // Clone the TagModal to modify it for editing
        const editModal = TagModal(`tag_edit_${ interaction.user.id }`)
            .setTitle(`Edit Tag`);

        // Modify the fields of the modal to display the current tag content
        editModal.components[0].components[0].setValue(tagName);
        editModal.components[1].components[0].setValue(tag.embed.title);
        if (tag.embed.description != null) {editModal.components[2].components[0].setValue(tag.embed.description);}
        if (tag.embed.footer != null) {editModal.components[3].components[0].setValue(tag.embed.footer);}

        await interaction.showModal(editModal);
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
    async modal_submit(interaction, client) {
        const tagEmbedName = interaction.fields.getTextInputValue("embed_name");
        const tagEmbedTitle = interaction.fields.getTextInputValue("embed_title");
        const tagEmbedDescription = interaction.fields.getTextInputValue("embed_description");
        const tagEmbedFooter = interaction.fields.getTextInputValue("embed_footer");

        let tag = await client.prisma.tag.findUnique({
            where: { tag_id: { name: tagEmbedName, guild_id: interaction.guild?.id! } },
            include: { embed: true },
        });

        if (!tag) {
            await interaction.reply({ embeds: [ TagNotFoundEmbed(tagEmbedName) ], ephemeral: true });
            return;
        }

        tag = await client.prisma.tag.update({
            where: { tag_id: { name: tagEmbedName, guild_id: interaction.guild?.id! } },
            data: {
                name: tagEmbedName,
                embed: {
                    update: {
                        title: tagEmbedTitle,
                        description: tagEmbedDescription,
                        footer: tagEmbedFooter
                    }
                }
            },
            include: { embed: true }
        });

        await interaction.reply({ embeds: [ OperationSuccessfull(`Tag \`${tagEmbedName}\` edited successfully.`), TagEmbed(tag) ], ephemeral: true });
    }
};
