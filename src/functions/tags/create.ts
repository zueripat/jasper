import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { OperationSuccessfull, TagEmbed, TagExistsAlready } from '../../components/embeds';
import { TagModal } from '../../components/modals';

export const createTag: Subcommand<ChatInputCommandInteraction> = {
    custom_ids: ['tag_create'],
    data: {
        name: 'create',
        description: 'Create a new tag',
        type: ApplicationCommandOptionType.Subcommand
    },
    async execute(interaction, _) {
        await interaction.showModal(TagModal(`tag_create_${ interaction.user.id }`));
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

        if (tag && tag.embed) {
            await interaction.reply({ embeds: [ TagExistsAlready(tagEmbedName) ], ephemeral: true });
            return;
        }

        tag = await client.prisma.tag.create({
            data: {
                name: tagEmbedName,
                guild: {
                    connectOrCreate: {
                        where: { id: interaction.guild?.id! },
                        create: { id: interaction.guild?.id! }
                    }
                },
                author: {
                    connectOrCreate: {
                        where: { id: interaction.user.id },
                        create: {
                            id: interaction.user.id,
                            guild_id: interaction.guild?.id!
                        }
                    }
                },
                embed: {
                    create: {
                        title: tagEmbedTitle,
                        description: tagEmbedDescription,
                        footer: tagEmbedFooter
                    }
                }
            },
            include: { embed: true }
        })

        await interaction.reply({ embeds: [ OperationSuccessfull(), TagEmbed(tag) ], ephemeral: true });
        return;
    }
}

