import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, CommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed } from "../configuration";

export default class Server extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Manage the server's settings.",
            GuildOnly: false,
            Name: "server",
            RequiredPermissions: [],
            SomePermissions: []
        });
    }

    async ExecuteCommand(interaction: CommandInteraction, client: Client) {
        if (interaction.inCachedGuild() && interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const Buttons = [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Add Birthday as Event")
                            .setEmoji("🎂")
                            .setCustomId("ADD_AS_BIRTHDAY")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("SETUP_APPEALS")
                            .setLabel("Setup Appeals")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("📫"),
                        new ButtonBuilder()
                            .setCustomId("SETUP_TICKETS")
                            .setLabel("Setup Tickets")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("🎟️"),
                        new ButtonBuilder()
                            .setCustomId("MODERATOR_SETTINGS")
                            .setLabel("Moderator Settings")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("🔒"),
                        new ButtonBuilder()
                            .setCustomId("SERVER_SETTINGS")
                            .setLabel("Server Settings")
                            .setEmoji("⚙️")
                            .setStyle(ButtonStyle.Secondary)
                    ),
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("AUTO_DELETE_SETTINGS")
                            .setLabel("Setup Auto Deleting")
                            .setEmoji("🗑️")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setLabel("Error Logs")
                            .setEmoji("⚠️")
                            .setCustomId("ERROR_LOG")
                            .setStyle(ButtonStyle.Secondary)
                    )
            ];

            await interaction.reply({
                embeds: [
                    new Embed()
                        .setTitle(`Managing ${interaction.guild.name}`)
                        .setColor(Colors.Blurple)
                        .setDescription(`Since you're managing ${interaction.guild.name}, you're able to use Beep Boop's \`/server\` command, that allows you to use multiple util actions.`)
                ],
                components: Buttons
            });
        } else {

        }
    }
}