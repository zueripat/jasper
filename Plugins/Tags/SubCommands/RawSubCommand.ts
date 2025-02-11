import { ApplicationCommandOptions, ApplicationCommandOptionType, Snowflake } from "@antibot/interactions";
import { Context } from "../../../Source/Context";
import { AttachmentBuilder, AutocompleteInteraction, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Options, Tag, TagResponse } from "../../../Services/TagService";

export const RawSubCommand: ApplicationCommandOptions = {
    name: "raw",
    description: "Get the raw content of a tag as a text attachment file.",
    type: ApplicationCommandOptionType.SUB_COMMAND,
    options: [
        {
            name: "tag-name",
            description: "Provide the name of the tag you would like to get as text attachment file!",
            type: ApplicationCommandOptionType.STRING,
            required: true,
            autocomplete: true
        }
    ]
} as ApplicationCommandOptions;

export async function raw(ctx: Context, interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    if (interaction.isChatInputCommand()) {
        if (interaction.options.getSubcommand() === RawSubCommand.name) {
            const guildId = interaction.guild.id;
            const name = interaction.options.getString('tag-name');

            await ctx.services.tags.configure<Options & { tag: Tag }>({ guildId, name });

            const exists = await ctx.services.tags.itemExists<Options>();

            if (!exists) return interaction.reply({ content: 'Tag not found!', flags: MessageFlags.Ephemeral });

            const { TagAuthor, TagName, TagEmbedTitle, TagEmbedDescription, TagEmbedImageURL, TagEmbedFooter, TagEditedBy } = await ctx.services.tags.getValues<Options, TagResponse>();

            const clean = (text: string) => { return text || "None" };

            const separator = "—————————————————————————————————————————";
            const fileContent = [
                "Tag Author", 
                clean(TagAuthor),
                separator.repeat(2),
                "Tag Name:",
                clean(TagName),
                separator.repeat(2),
                "Tag Title:",
                clean(TagEmbedTitle),
                separator.repeat(2), 
                "Tag Description:",
                clean(TagEmbedDescription),
                separator.repeat(2),
                "Tag Image Url:",
                clean(TagEmbedImageURL),
                separator.repeat(2),
                "Tag Footer:",
                clean(TagEmbedFooter),
                separator.repeat(2),
                "Last Edited By:",
                clean(TagEditedBy)
            ].join('\n');

            const attachment = new AttachmentBuilder(Buffer.from(fileContent, "utf-8"), { name: `${TagName}.txt` });

            return interaction.reply({ content: `Here is the raw content of the tag \`${TagName}\`:`, files: [attachment], flags: MessageFlags.Ephemeral });
        }
    }

    if (interaction.isAutocomplete()) {
        if (interaction.options.getSubcommand() === RawSubCommand.name) {
            const focus = interaction.options.getFocused();

            const tags = await ctx.services.tags.getMultiValues<Snowflake, TagResponse[]>(interaction.guild.id);
            const filteredTags = focus.length > 0 ? tags.filter((tag) => tag.TagName.toLowerCase().includes(focus.toLowerCase())) : tags;

            await interaction.respond(filteredTags.map((tag) => ({ name: tag.TagName, value: tag.TagName })).slice(0, 20));
        }
    }
}
