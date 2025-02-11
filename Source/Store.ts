import { Redis } from "ioredis";
import { Context } from "./Context";
import { Snowflake } from "@antibot/interactions";

type GuildSnowflake = Record<"guild", Snowflake>;

type UserSnowflake = Record<"user", Snowflake>;

export class Store extends Redis {
    #ctx: Context;
    constructor(protected ctx: Context) {
        super({
            host: ctx.env.get("redis_host"),
            port: ctx.env.get("redis_port") as number
        });
        this.#ctx = ctx;
    }

    public async getGuild<T>(options: GuildSnowflake): Promise<T> {
        return JSON.parse(await this.get(JSON.stringify(options)));
    }

    public async getUser<T>(options: UserSnowflake): Promise<T> {
        return JSON.parse(await this.get(JSON.stringify(options)));
    }

    public async findGuild(options: GuildSnowflake): Promise<boolean> {
        return await this.getGuild(options) ? true : false;
    }

    public async findUser(options: UserSnowflake): Promise<boolean> {
        return await this.getUser(options) ? true : false;
    }

    public deleteGuild(options: GuildSnowflake | UserSnowflake): void {
        this.del(JSON.stringify(options));
    }

    public setKey<T>(options: GuildSnowflake | UserSnowflake, ...keys: T[] | []): void {
        this.set(JSON.stringify(options), JSON.stringify(keys || []));
    }

    public async setUserKey<T>(options: UserSnowflake, data: T): Promise<void> {
        await this.set(JSON.stringify(options), JSON.stringify(data));
    }

    public async setForeignKey<T>(options: Object | string, data: T): Promise<void> {
        await this.set(JSON.stringify(options), JSON.stringify(data));
    }

    public guildExists(options: GuildSnowflake | UserSnowflake): Promise<number> {
        return this.exists(JSON.stringify(options));
    }
}