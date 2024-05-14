import { config } from 'dotenv';
import { resolve } from 'node:path';
import process from 'node:process';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../../.env') });

// Define the environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const DISCORD_BOT_TOKEN = process.env.TOKEN;
const DISCORD_CLIENT_ID = process.env.APPLICATION_ID;
const DISCORD_DEV_GUILD_ID = process.env.DEV_GUILD_ID;

// Ensure all environment variables are set
switch (true) {
    case !DATABASE_URL:
        throw new Error('DATABASE_URL not set in environment');
    case !DISCORD_BOT_TOKEN:
        throw new Error('TOKEN not set in environment');
    case !DISCORD_CLIENT_ID:
        throw new Error('APPLICATION_ID not set in environment');
    default:
        break;
}

// Export the environment variables for use in the application
export { DATABASE_URL, DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_DEV_GUILD_ID };
