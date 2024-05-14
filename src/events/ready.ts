import { Event } from '../util/types.js';
import { ActivityType, Events } from 'discord.js';
import { logger } from '../util/logging.js';

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
