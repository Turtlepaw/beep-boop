import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, CommandInteraction, PermissionsBitField } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed } from "../configuration";

export default class Developer extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Utils built for the developer, but anyone can use them.",
            GuildOnly: false,
            Name: "developer",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Server
        });
    }

    async ExecuteCommand(interaction: CommandInteraction, client: Client) {
        if (interaction.inCachedGuild() && interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const Buttons = [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("See Command Id")
                            .setEmoji("📜")
                            .setCustomId("SEE_COMMANDS")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setLabel("Test Appeal System")
                            .setEmoji("👆")
                            .setCustomId("TEST_APPEALS")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setLabel("Eval")
                            .setEmoji("📦")
                            .setCustomId("EVAL_CODE")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(interaction.user.id != "820465204411236362"),
                        new ButtonBuilder()
                            .setLabel("Refresh Update Channels")
                            .setEmoji("☁️")
                            .setCustomId("REFRESH_UPDATE_CHANNELS")
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(interaction.user.id != "820465204411236362"),
                        new ButtonBuilder()
                            .setLabel("Restart")
                            .setEmoji("🔃")
                            .setCustomId("REFRESH_BOT")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(interaction.user.id != "820465204411236362"),
                    ),
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Gift")
                            .setEmoji("🎁")
                            .setCustomId("CREATE_GIFT")
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(interaction.user.id != "820465204411236362")
                    )
            ]

            await interaction.reply({
                content: "```\n[Showing past 6 log messages]\n\n[Diagnostics] Getting emergency diagnostic ready...\n[Diagnostics] Attempting to restart systems...\n[Diagnostics] Restarting systems...\n[Diagnostics] DONE... Restarted system\n[Diagnostics] Showing diagnostic information...\n[Diagnostics] DONE...```",
                components: Buttons
            });
        } else {

        }
    }
}