import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, codeBlock, Colors, CommandInteraction, PermissionsBitField } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed } from "../configuration";
import { Logger } from "../logger";
import fs from "fs";

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
                            .setDisabled(interaction.user.id != "820465204411236362"),
                        new ButtonBuilder()
                            .setLabel("Realtime Logs")
                            .setEmoji("⚙️")
                            .setCustomId("REALTIME_LOGS")
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(interaction.user.id != "820465204411236362")
                    )
            ]

            const logs = await fs.readFileSync("./log.json");
            const raw = logs.toString().split("\n").filter(e => e != "").slice(-6);
            const ResolvedLogs: { level: number; msg: string; time: number; type: string; }[] = raw.map(e => ({
                ...JSON.parse(e),
                type: Logger.levels.labels[JSON.parse(e).level]
            }));
            await interaction.reply({
                content: `${codeBlock("json", `//[Showing past 6 log messages]\n\n${ResolvedLogs.map(e => `[${e.type}] ${e.msg}`).join("\n")}`)}`,
                //content: "```\n[Showing past 6 log messages]\n\n[Diagnostics] Getting emergency diagnostic ready...\n[Diagnostics] Attempting to restart systems...\n[Diagnostics] Restarting systems...\n[Diagnostics] DONE... Restarted system\n[Diagnostics] Showing diagnostic information...\n[Diagnostics] DONE...```",
                components: Buttons
            });
        } else {

        }
    }
}