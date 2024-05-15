import {
    APIApplicationCommandOption,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    ContextMenuCommandInteraction,
    ModalSubmitInteraction,
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIApplicationGuildCommandsJSONBody,
} from 'discord.js';
import type { Bot } from './client';

export type CommandInteraction = ChatInputCommandInteraction | ContextMenuCommandInteraction;

export interface BaseCommand<Interaction extends CommandInteraction> {
    custom_ids?: string[];
    execute: (interaction: Interaction, client: Bot) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction, client: Bot) => Promise<void>;
    modal_submit?: (interaction: ModalSubmitInteraction, client: Bot) => Promise<void>;
}

export interface StandaloneCommand<Interaction extends CommandInteraction, Global extends boolean> extends BaseCommand<Interaction> {
    global?: Global;
    data: Global extends true ? RESTPostAPIApplicationCommandsJSONBody : RESTPostAPIApplicationGuildCommandsJSONBody;
}

export interface Subcommand<Interaction extends CommandInteraction> extends BaseCommand<Interaction> {
    data: APIApplicationCommandOption;
}

export interface CommandGroup<Interaction extends CommandInteraction, Global extends boolean> extends BaseCommand<Interaction> {
    global?: Global;
    data: Global extends true ? RESTPostAPIApplicationCommandsJSONBody : RESTPostAPIApplicationGuildCommandsJSONBody;
    subcommands: Record<string, Subcommand<Interaction>>;
}

export interface Event<T extends keyof ClientEvents> {
    once?: boolean;
    name: T;
    execute: (client: Bot, ...args: ClientEvents[T]) => Promise<void>;
}
