import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, Colors, CommandInteraction, Interaction, PermissionsBitField, RepliableInteraction, SelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons } from "../configuration";

export enum Modules {
    AutonomousCleanup = "AUTO_DELETE_SETTINGS",
    Appeals = "APPEAL_CONFIGURATION",
    Tickets = "TICKET_CONFIGURATION",
    ReputationBasedModeration = "REPUTATION_BASED_MODERATION_CONFIG",
    AutonomousModeration = "AUTO_MODERATION",
    JoinActions = "MEMBER_JOIN_ACTIONS",
    ServerConfiguration = "MAIN_SERVER_CONFIG"
}
export function ServerConfiguration(interaction: RepliableInteraction) {
    const Buttons = [
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ADD_AS_BIRTHDAY")
                    .setLabel("Add Birthday as Event")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel("Error Logs")
                    .setEmoji("⚠️")
                    .setCustomId("ERROR_LOG")
                    .setStyle(ButtonStyle.Secondary)
            ),
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("ConfigureMenu")
                    .setPlaceholder("Configure an module")
                    .setMaxValues(1)
                    .addOptions(
                        new SelectMenuOptionBuilder()
                            .setValue(Modules.Appeals)
                            .setDescription("Appeals let users ask moderators to review their case/punishment.")
                            .setEmoji(Icons.Discover)
                            .setLabel("Appeals"),
                        new SelectMenuOptionBuilder()
                            .setValue(Modules.Tickets)
                            .setDescription("Tickets let members have a private space to discuss things with moderators.")
                            .setLabel("Tickets")
                            .setEmoji(Icons.Flag),
                        new SelectMenuOptionBuilder()
                            .setValue(Modules.AutonomousModeration)
                            .setDescription("Autonomous Moderation moderates your server automatically.")
                            .setLabel("Autonomous Moderation")
                            .setEmoji(Icons.Shield),
                        new SelectMenuOptionBuilder()
                            .setValue(Modules.AutonomousCleanup)
                            .setDescription("Autonomous cleanup cleans up old messages that members sent. (e.g. system welcome messages)")
                            .setLabel("Autonomous Cleanup")
                            .setEmoji(Icons.Trash),
                        new SelectMenuOptionBuilder()
                            .setValue(Modules.ServerConfiguration)
                            .setDescription("Main server configuration.")
                            .setLabel("Server")
                            .setEmoji(Icons.Configure),
                        new SelectMenuOptionBuilder()
                            .setValue(Modules.JoinActions)
                            .setDescription("Set up join actions for when members join your server.")
                            .setLabel("Join Actions")
                            .setEmoji(Icons.Lock)
                    )
            )
    ];

    const payload = {
        embeds: [
            new Embed(interaction.guild)
                .setTitle(`Managing ${interaction.guild.name}`)
                .setColor(Colors.Blurple)
                .setDescription(`Since you're managing ${interaction.guild.name}, you're able to configure ${interaction.guild.name}'s modules. Select a module to get started!`)
        ],
        components: Buttons
    }

    if (interaction.isButton()) {
        interaction.update(payload);
    } else return interaction.reply(payload);
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