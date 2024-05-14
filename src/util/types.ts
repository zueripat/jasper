import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    ContextMenuCommandInteraction,
    ModalSubmitInteraction,
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIApplicationGuildCommandsJSONBody,
} from 'discord.js';
import type { PrismaClient } from '@prisma/client';

export type CommandInteraction = ChatInputCommandInteraction | ContextMenuCommandInteraction;

export interface Command<EInteraction extends CommandInteraction, Global extends Boolean> {
    global?: Global;
    custom_ids?: string[];
    data: Global extends true ? RESTPostAPIApplicationCommandsJSONBody : RESTPostAPIApplicationGuildCommandsJSONBody;
    execute: (interaction: EInteraction, client: PrismaClient) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction, client: PrismaClient) => Promise<void>;
    modal_submit?: (interaction: ModalSubmitInteraction, client: PrismaClient) => Promise<void>;
}

export interface Event<T extends keyof ClientEvents> {
    once?: boolean;
    name: T;
    execute: (client: PrismaClient, ...args: ClientEvents[T]) => Promise<void>;
}
