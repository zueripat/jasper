// src/functions/root/config.ts
import { Subcommand } from '../../util/types';
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { OperationSuccessfull } from '../../components/embeds';

export const config: Subcommand<ChatInputCommandInteraction> = {
    data: {
        name: 'config',
        description: 'Configure guild settings',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'key',
                description: 'The guild setting to configure',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'Prefix',
                        value: 'prefix',
                    },
                    {
                        name: 'Admin Role',
                        value: 'adminRole',
                    },
                    {
                        name: 'Support Role',
                        value: 'supportRole',
                    },
                    {
                        name: 'Staff Role',
                        value: 'staffRole',
                    },
                ],
            },
            {
                name: 'value',
                description: 'The new value for the setting',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    async execute(interaction, client) {
        const key = interaction.options.getString('key', true);
        const value = interaction.options.getString('value', true);

        // Update guild settings in the database based on the key
        await client.prisma.guild.update({
            where: { id: interaction.guild?.id },
            data: {
                [key]: value,
            },
        });

        await interaction.reply({ embeds: [OperationSuccessfull(`Guild configuration for \`${key}\` updated successfully to \`${value}\`.`)], ephemeral: true });
    }
}
