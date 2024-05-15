<p align="center"><img src="https://github.com/JayyDoesDev/jasper/blob/main/.github/assets/jasper.png?raw=true" alt="jasper" width="500"></p>
<h1 align="center">Jasper</h1>
<h2 align="center">🏷️ The Utility Discord bot for tags and subscriber count for the No Text To Speech Discord Server!</h2>

## Introduction
Jasper is a Discord bot designed to provide utility features such as tag management and subscriber count tracking for the No Text To Speech Discord Server. With Jasper, users can create, edit, delete, and use tags within the server, as well as keep track of the server's subscriber count.

<p align="center">
<img src="https://github.com/JayyDoesDev/jasper/blob/main/.github/assets/Discord_AQ502PtCZj.gif?raw=true" alt="showcase">
</p>

## Features
- **Tag Management**: Jasper allows users to create custom tags containing text or embeds, which can be used by other members of the server.
- **Subscriber Count Tracking**: Jasper tracks the number of subscribers in the server and provides real-time updates.
- **Flexible Configuration**: Jasper offers various configuration options to tailor its behavior to suit the server's needs.
- **Easy Integration**: Jasper seamlessly integrates with the No Text To Speech Discord Server and can be easily added to other servers as well.

## Usage
To use Jasper, invite the bot to your Discord server and grant it the necessary permissions. Once added, users can interact with Jasper using the provided commands to manage tags, track subscriber counts, and more.

## Installation
To host your own instance of Jasper, follow these steps:
1. Clone this repository to your local machine.
2. Install the required dependencies using `yarn`.
3. Configure Jasper by creating a `.env` file in the root directory and adding the following environment variables:
   - `APPLICATION_ID`: Your bot's application ID from the Discord Developer Portal.
   - `TOKEN`: Your bot's token from the Discord Developer Portal.
   - `DEV_GUILD_ID`: ID of the development guild where you want to test your bot.
   - `DISCORD_ADMIN_ROLE`: ID of the role for admin members.
   - `DISCORD_STAFF_ROLE`: ID of the role for staff members.
   - `DISCORD_SUPPORT_ROLE`: ID of the role for support members.
   - `DATABASE_URL`: Your MongoDB connection string, with <username>, <password>, <server>, and <database> replaced with your actual MongoDB credentials and database name.
   - `YOUTUBE_CHANNEL_ID`: YouTube channel ID for subscriber count tracking.
   - `YOUTUBE_KEY`: API key for YouTube Data API.
   - `SUB_COUNT_CHANNEL`: ID of the channel where subscriber count updates will be posted.
   - `SUB_COUNT_TIMER`: Interval in milliseconds for subscriber count updates.
   - `SUB_COUNT_UPDATE`: Set to 1 to enable automatic subscriber count updates, 0 to disable.

4. Run the bot in development using:
    ```sh
    npm install
    ```

5. Optionally you can deploy it locally using mongodb or postgresql as the database.
    ```sh
    npm run docker-start
    ```
## Contributing
Contributions to Jasper are welcome! If you encounter any issues or have ideas for new features, feel free to open an issue or submit a pull request. Make sure to follow the contribution guidelines outlined in `CONTRIBUTING.md`.

## License
Jasper is licensed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ by JayyDoesDev & zueripat</p>
