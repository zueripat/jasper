import { ApplicationCommandOptions, ApplicationCommandOptionType } from "@antibot/interactions";
import { Context } from "../../Source/Context";
import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { RegisterSubCommand } from "../../Common/RegisterSubCommand";

export const EditSubCommand: ApplicationCommandOptions = {
    name: "edit",
    description: "Edit a tag!",
    type: ApplicationCommandOptionType.SUB_COMMAND,
    options: []
} as ApplicationCommandOptions;

export async function RunEditSubCommand(ctx: Context, interaction: ChatInputCommandInteraction) {
    await RegisterSubCommand({
        subCommand: "edit",
        ctx: ctx,
        interaction: interaction,
        callback: async (ctx: Context, interaction: ChatInputCommandInteraction) => {
            const modal: ModalBuilder = new ModalBuilder()
                .setCustomId(`tag_edit_${ interaction.user.id }`)
                .setTitle("Support Tag Edit")
            const tagEmbedName: TextInputBuilder = new TextInputBuilder()
                .setCustomId("tag_edit_embed_name")
                .setLabel("Tag")
                .setPlaceholder("support")
                .setMaxLength(80)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const tagEmbedTitle: TextInputBuilder = new TextInputBuilder()
                .setCustomId("tag_edit_embed_title")
                .setLabel("Embed Title")
                .setPlaceholder("How do I contact support?")
                .setMaxLength(200)
                .setStyle(TextInputStyle.Short)
                .setRequired(false);
            const TagEmbedDescription: TextInputBuilder = new TextInputBuilder()
                .setCustomId("tag_edit_embed_description")
                .setLabel("Embed Description")
                .setPlaceholder("You can contact us in the support threads!")
                .setMaxLength(3000)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false);
            const TagEmbedFooter: TextInputBuilder = new TextInputBuilder()
                .setCustomId("tag_edit_embed_footer")
                .setLabel("Embed Footer")
                .setPlaceholder("Make sure to be patient!")
                .setMaxLength(40)
                .setStyle(TextInputStyle.Short)
                .setRequired(false);
            const tagEmbedNameRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(tagEmbedName);
            const tagEmbedTitleRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(tagEmbedTitle);
            const TagEmbedDescriptionRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(TagEmbedDescription);
            const tagEmbedFooterRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(TagEmbedFooter);
            modal.addComponents(tagEmbedNameRow, tagEmbedTitleRow, TagEmbedDescriptionRow, tagEmbedFooterRow);
            await interaction.showModal(modal);
        }
    })
}
