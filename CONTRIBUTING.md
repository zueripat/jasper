# Contributing to Jasper

Thank you for your interest in contributing to Jasper! We welcome contributions in various forms, including bug reports, feature requests, code contributions, and documentation improvements. Please follow the guidelines below to ensure a smooth contribution process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
- [Style Guides](#style-guides)
    - [Git Commit Messages](#git-commit-messages)
    - [Code Style](#code-style)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by the [Jasper Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [email@example.com].

## How to Contribute

### Reporting Bugs

If you find a bug in the project, please open an issue on GitHub and include the following information:

- A clear and descriptive title.
- A detailed description of the issue.
- Steps to reproduce the issue.
- Any relevant error messages or screenshots.

### Suggesting Features

If you have an idea for a new feature, please open an issue on GitHub and include the following information:

- A clear and descriptive title.
- A detailed description of the feature and its benefits.
- Any relevant examples or use cases.

### Code Contributions

We welcome code contributions! To get started, follow these steps:

1. **Fork the repository**: Click the "Fork" button on the top right of the repository page and clone your fork locally.
2. **Create a new branch**: Create a new branch for your work. Use a descriptive name for your branch (e.g., `feature/add-tag-management`).
3. **Make your changes**: Make your changes to the codebase, ensuring you follow the project's coding standards.
4. **Commit your changes**: Commit your changes with a clear and descriptive commit message.
5. **Push to your fork**: Push your changes to your forked repository.
6. **Open a pull request**: Open a pull request to the `main` branch of the original repository. Include a detailed description of your changes and any relevant issues.

## Development Setup

To set up a development environment, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/jasper.git
    cd jasper
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Configure environment variables**: Create a `.env` file in the root directory and add the following variables:
    ```dotenv
    NODE_ENV=development

    #######################################
    # Discord Secrets
    #######################################
    APPLICATION_ID=your_application_id
    TOKEN=your_bot_token
    DEV_GUILD_ID=your_dev_guild_id
    DISCORD_ADMIN_ROLE=your_admin_role_id
    DISCORD_STAFF_ROLE=your_staff_role_id
    DISCORD_SUPPORT_ROLE=your_support_role_id

    #######################################
    # Database Secrets
    #######################################
    DATABASE_URL=mongodb+srv://<username>:<password>@<server>.mongodb.net/<database>?retryWrites=true&w=majority

    #######################################
    # YouTube Secrets
    # 1 = true, 0 = false
    #######################################
    YOUTUBE_CHANNEL_ID=your_youtube_channel_id
    YOUTUBE_KEY=your_youtube_api_key
    SUB_COUNT_CHANNEL=your_sub_count_channel_id
    SUB_COUNT_TIMER=interval_in_milliseconds
    SUB_COUNT_UPDATE=0  # Set to 1 to enable automatic subscriber count updates
    ```

4. **Run the bot in development**:
    ```sh
    npm run start
    ```

5. **Optionally deploy locally using Docker**:
    ```sh
    npm run docker-start
    ```

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests when relevant.

### Code Style

- Follow the coding standards used in the project.
- Use consistent indentation and spacing.
- Write clear and descriptive variable and function names.

## License

By contributing to Jasper, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Jasper! Your support is greatly appreciated.
