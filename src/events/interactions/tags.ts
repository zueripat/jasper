import { CommandGroup  } from '../../util/types';
import { ApplicationCommandType, ChatInputCommandInteraction } from 'discord.js';
import { NotImplementedEmbed, OperationFailed } from '../../components/embeds';

import { createTag } from '../../functions/tags/create';
import { deleteTag } from '../../functions/tags/delete';
import { listTags } from '../../functions/tags/list';
import { useTag } from '../../functions/tags/use';
import { inspectTag } from '../../functions/tags/inspect';
import { editTag } from '../../functions/tags/edit';

const tagsCommandGroup: CommandGroup<ChatInputCommandInteraction, false> = {
    global: false,
    custom_ids: [
        ...createTag.custom_ids || [],
        ...deleteTag.custom_ids || [],
        ...listTags.custom_ids || [],
        ...useTag.custom_ids || [],
        ...inspectTag.custom_ids || [],
        ...editTag.custom_ids || [],
    ],
    data: {
        name: 'tags',
        description: 'Tag related commands',
        type: ApplicationCommandType.ChatInput,
        options: [
            createTag.data,
            deleteTag.data,
            listTags.data,
            useTag.data,
            inspectTag.data,
            editTag.data,
        ],
    },
    subcommands: {
        create: createTag,
        delete: deleteTag,
        list: listTags,
        use: useTag,
        inspect: inspectTag,
        edit: editTag,
    },
    async execute(interaction, client) {
        type Subcommands = keyof typeof tagsCommandGroup.subcommands;
        const subcommand = interaction.options.getSubcommand() as Subcommands;

        if (!interaction.guild) {
            await interaction.reply({ embeds: [ OperationFailed('This command can only be used in a guild') ], ephemeral: true });
            return;
        }

        const guildSettings = client.cache.guilds.get(interaction.guild.id);
        if (!guildSettings || ! guildSettings.staffRole || !guildSettings.supportRole || !guildSettings.adminRole) {
            await interaction.reply({ embeds: [ OperationFailed('Guild settings are not configured properly or not found') ], ephemeral: true });
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);
        const memberRoles = member.roles.cache.map(role => role.id);
        const hasAdminRole = memberRoles.includes(guildSettings.adminRole);
        const hasSupportRole = memberRoles.includes(guildSettings.supportRole);
        const hasStaffRole = memberRoles.includes(guildSettings.staffRole);

        const noAccessEmbed = OperationFailed('You do not have the required roles to use this command');

        if (!hasAdminRole && !hasSupportRole && !hasStaffRole) {
            await interaction.reply({ embeds: [ noAccessEmbed ], ephemeral: true });
            return;
        }
        switch (subcommand) {
            case 'create': {
                if (!hasAdminRole && !hasSupportRole) {
                    await interaction.reply({ embeds: [ noAccessEmbed ], ephemeral: true });
                    return;
                }
                await createTag.execute(interaction, client);
                break;
            }
            case 'delete': {
                if (!hasAdminRole && !hasSupportRole) {
                    await interaction.reply({ embeds: [ noAccessEmbed ], ephemeral: true });
                    return;
                }
                await deleteTag.execute(interaction, client);
                break;
            }
            case 'list': {
                await listTags.execute(interaction, client);
                break;
            }
            case 'use': {
                await useTag.execute(interaction, client);
                break;
            }
            case 'inspect': {
                await inspectTag.execute(interaction, client);
                break;
            }
            default: {
                console.warn(`[ ${ subcommand } ] - 🛠️ Under Consturction / Not implemented yet`);
                await interaction.reply({ embeds: [ NotImplementedEmbed(subcommand) ], ephemeral: true });
                return;
            }
        }
    },
    async autocomplete(interaction, client) {
        type Subcommands = keyof typeof tagsCommandGroup.subcommands;
        const subcommand = interaction.options.getSubcommand() as Subcommands;

        if (!interaction.guild) {
            await interaction.respond([]);
            return;
        }

        const guildSettings = client.cache.guilds.get(interaction.guild.id);
        if (!guildSettings || ! guildSettings.staffRole || !guildSettings.supportRole || !guildSettings.adminRole) {
            await interaction.respond([]);
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);
        const memberRoles = member.roles.cache.map(role => role.id);
        const hasAdminRole = memberRoles.includes(guildSettings.adminRole);
        const hasSupportRole = memberRoles.includes(guildSettings.supportRole);
        const hasStaffRole = memberRoles.includes(guildSettings.staffRole);

        if (!hasAdminRole && !hasSupportRole && !hasStaffRole) {
            await interaction.respond([]);
            return;
        }

        switch (subcommand) {
            case 'delete': {
                if (!hasAdminRole && !hasSupportRole) {
                    await interaction.respond([]);
                    return;
                }
                deleteTag.autocomplete && await deleteTag.autocomplete(interaction, client);
                break;
            }
            case 'edit': {
                if (!hasAdminRole && !hasSupportRole) {
                    await interaction.respond([]);
                    return;
                }
                editTag.autocomplete && await editTag.autocomplete(interaction, client);
                break;
            }
            case 'inspect': {
                inspectTag.autocomplete && await inspectTag.autocomplete(interaction, client);
                break;
            }
            case 'use': {
                useTag.autocomplete && await useTag.autocomplete(interaction, client);
                break;
            }
            default: {
                console.warn(`[ ${ subcommand } ] - 🛠️ Under Consturction / Not implemented yet`);
                await interaction.respond([ { name: '🛠️ Under Consturction / Not implemented yet', value: 'NotImplemented' } ]);
                return;
            }
        }
    },
};

export default tagsCommandGroup;
