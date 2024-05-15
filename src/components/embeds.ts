import type { Tag, Embed } from '@prisma/client'
import { Emojis } from './constants';
import { Colors, EmbedBuilder, inlineCode } from 'discord.js';

export const OperationSuccessfull = (description?: string) => new EmbedBuilder()
    .setColor(Colors.DarkGreen)
    .setAuthor({ name: `Operation Successfull` })
    .setDescription(description || 'The operation was completed successfully')
    .setTimestamp();

export const OperationFailed = (description?: string) => new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setAuthor({ name: `Operation Failed` })
    .setDescription(description || 'The operation failed')
    .setTimestamp();

export const TagNotFoundEmbed = (name: string) => new EmbedBuilder()
    .setColor(Colors.Orange)
    .setTitle(`Not Found ${Emojis.CROSS_MARK}`)
    .setDescription(`The tag ${inlineCode(name)} does not exists or could not be found!`)
    .setTimestamp();

export const TagExistsAlready = (name: string) => new EmbedBuilder()
    .setColor(Colors.Orange)
    .setTitle(`Already Exists ${Emojis.CROSS_MARK}`)
    .setDescription(`The tag ${inlineCode(name)} does already exist!`)
    .setTimestamp();

export const TagEmbed = (tag: Tag & { embed: Embed }) => new EmbedBuilder()
    .setColor(Colors.DarkGreen)
    .setTitle(tag.embed.title)
    .setDescription(tag.embed.description)
    .setFooter(tag.embed.footer ? { text: tag.embed.footer } : null);

export const NotImplementedEmbed = (subcommand: string) => new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle("🛠️ Not implemented yet!")
    .setDescription(`${Emojis.INFO_MARK} The command ${inlineCode(subcommand)} does not seem to be implemented yet!`)
    .setTimestamp();
