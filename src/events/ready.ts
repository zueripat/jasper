import { Event } from '../util/types';
import { logger } from '../util/logging';
import { ActivityType, Events } from 'discord.js';

const log = logger.child({ name: 'ready', type: 'event' });

const readyEvent: Event<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    async execute(_, client) {
        log.info(`Logged in as ${client.user.tag}!`);

        client.user.setActivity('Jasper', { type: ActivityType.Watching });
    },
};

export default readyEvent;
