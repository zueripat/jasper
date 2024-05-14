import { CronJob } from 'cron';
import type { Guild, PrismaClient } from '@prisma/client';

export default class Cache {
    public guilds = new Map<string, Guild>();
    private client: PrismaClient;

    constructor(client: PrismaClient) {
        this.client = client;
        new CronJob(
            "*/10 * * * *",
            async () => {
                await this.revalidateGuilds();
            },
            null,
            true
        )
    }

    public async revalidateGuilds() {
        this.guilds.clear();
        const guilds = await this.client.guild.findMany();
        for (const guild of guilds) {
            this.guilds.set(guild.id, guild)
        }
    }
}
