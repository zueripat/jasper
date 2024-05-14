import { Event } from '../util/types';
import { Events, ChannelType } from 'discord.js';

const messageCreateEvent: Event<Events.MessageCreate> = {
    name: Events.MessageCreate,
    once: false,
    async execute(client, message) {
        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) return;

        /**
         * @todo Implement original logic
         */
    },
};

export default messageCreateEvent;
