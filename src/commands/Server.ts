import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, Colors, CommandInteraction, Interaction, PermissionsBitField, RepliableInteraction, SelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons } from "../configuration";

export enum Modules {
    AutonomousCleanup = "AUTO_DELETE_SETTINGS",
    Appeals = "APPEAL_CONFIGURATION",
    Tickets = "TICKET_CONFIGURATION",
    //ReputationBasedModeration = "REPUTATION_BASED_MODERATION_CONFIG",
    AutonomousModeration = "AUTO_MODERATION",
    JoinActions = "MEMBER_JOIN_ACTIONS",
    ServerConfiguration = "MAIN_SERVER_CONFIG",
    Verification = "SERVER_VERIFICATION"
}

export const ModuleInformation: Record<Modules, { Label: string; Description: string; Icon: Icons; }> = {
    [Modules.Appeals]: {
        Label: "Appeals",
        Description: "Appeals let users ask moderators to review their case/punishment.",
        Icon: Icons.Discover
    },
    [Modules.Tickets]: {
        Label: "Tickets",
        Description: "Tickets let members have a private space to discuss things with moderators.",
        Icon: Icons.Flag
    },
    [Modules.AutonomousModeration]: {
        Label: "Autonomous Moderation",
        Description: "Autonomous Moderation moderates your server automatically.",
        Icon: Icons.Shield
    },
    [Modules.AutonomousCleanup]: {
        Label: "Autonomous Cleanup",
        Description: "Autonomous cleanup cleans up old messages that members sent. (e.g. system welcome messages)",
        Icon: Icons.TrashDefault
    },
    [Modules.JoinActions]: {
        Label: "Join Actions",
        Description: "Set up join actions for when members join your server.",
        Icon: Icons.Tag
    },
    [Modules.ServerConfiguration]: {
        Label: "Server Configuration",
        Description: "Essential configuration for your server.",
        Icon: Icons.Configure
    },
    [Modules.Verification]: {
        Label: "Verification",
        Description: "Protect your server with member verification.",
        Icon: Icons.Unlock
    }
}

export const AdvancedButtonId = "ADVANCED_GUILD_CONF";
export async function ServerConfiguration(interaction: RepliableInteraction) {
    const Buttons = [
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ADD_AS_BIRTHDAY")
                    .setEmoji(Icons.Sync)
                    .setLabel("Add Birthday as Event")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setLabel("Error Logs")
                    .setEmoji(Icons.Print)
                    .setCustomId("ERROR_LOG")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setLabel("Advanced")
                    .setEmoji(Icons.Advanced)
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(AdvancedButtonId)
            ),
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("ConfigureMenu")
                    .setPlaceholder("Configure an module")
                    .setMaxValues(1)
                    .addOptions(
                        Object.entries(ModuleInformation).map(([k, v]) =>
                            new SelectMenuOptionBuilder()
                                .setLabel(v.Label)
                                .setDescription(v.Description)
                                .setEmoji(v.Icon)
                                .setValue(k)
                        )
                    )
            )
    ];

    const payload = async () => ({
        embeds: [
            await new Embed(interaction.guild)
                .setTitle(`Managing ${interaction.guild.name}`)
                .setDescription(`Since you're managing ${interaction.guild.name}, you're able to configure ${interaction.guild.name}'s modules. Select a module to get started!`)
                .Resolve()
        ],
        components: Buttons
    })

    try {
    if (interaction.isButton()) {
        await interaction.update(await payload());
    } else return await interaction.reply(await payload());
} catch {}
}

export default class Server extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Manage the server's settings.",
            GuildOnly: false,
            Name: "configuration",
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"],
            Category: Categories.Server
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        if (interaction.inCachedGuild() /*&& interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)*/) {
            await ServerConfiguration(interaction);
        } else {

        }
    }
}
