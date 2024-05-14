import { GatewayIntentBits, Partials } from 'discord.js';
import { Bot } from './util/client.js';

const client = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

process.on('unhandledRejection', (error) => console.log(error));

process.on('uncaughtException', (error) => console.log(error));

void client.login();
