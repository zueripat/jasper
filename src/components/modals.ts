import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const tagEmbedName: TextInputBuilder = new TextInputBuilder()
    .setCustomId("embed_name")
    .setLabel("Tag")
    .setPlaceholder("support")
    .setMaxLength(80)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const tagEmbedTitle: TextInputBuilder = new TextInputBuilder()
    .setCustomId("embed_title")
    .setLabel("Embed Title")
    .setPlaceholder("How do I contact support?")
    .setMaxLength(200)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const TagEmbedDescription: TextInputBuilder = new TextInputBuilder()
    .setCustomId("embed_description")
    .setLabel("Embed Description")
    .setPlaceholder("You can contact us in the support threads!")
    .setMaxLength(3000)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

const TagEmbedFooter: TextInputBuilder = new TextInputBuilder()
    .setCustomId("embed_footer")
    .setLabel("Embed Footer")
    .setPlaceholder("Make sure to be patient!")
    .setMaxLength(40)
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

const tagEmbedNameRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(tagEmbedName);
const tagEmbedTitleRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(tagEmbedTitle);
const TagEmbedDescriptionRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(TagEmbedDescription);
const tagEmbedFooterRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(TagEmbedFooter);

export const TagModal = (custom_id: string) => new ModalBuilder()
    .setCustomId(custom_id)
    .setTitle("Support Tag Create")
    .setComponents([tagEmbedNameRow, tagEmbedTitleRow, TagEmbedDescriptionRow, tagEmbedFooterRow])
