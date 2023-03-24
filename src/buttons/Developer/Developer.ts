import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, codeBlock } from "discord.js";
import { Icons } from "../../configuration";
import { Logger } from "../../logger";
import fs from "fs";
import Button from "../../lib/ButtonBuilder";
import { DeveloperPortal } from "../../commands/Bot/Help";

export enum ButtonIds {
    Subscriptions = "FORCE_SUBSCRIPTIONS",
    Profiles = "SET_PROFILES"
}

export default class DeveloperPortalButton extends Button {
    constructor() {
        super({
            CustomId: DeveloperPortal,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        const Buttons = [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    // new ButtonBuilder()
                    //     .setLabel("See Command Id")
                    //     .setEmoji("📜")
                    //     .setCustomId("SEE_COMMANDS")
                    //     .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Execute Codeblock")
                        .setEmoji(Icons.Zap)
                        .setCustomId("EVAL_CODE")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Refresh Update Channels")
                        .setEmoji(Icons.Channel)
                        .setCustomId("REFRESH_UPDATE_CHANNELS")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Restart (danger)")
                        .setEmoji(Icons.Refresh)
                        .setCustomId("REFRESH_BOT")
                        .setStyle(ButtonStyle.Secondary),
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Gift")
                        .setEmoji(Icons.Gift)
                        .setCustomId("CREATE_GIFT")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Realtime Logs")
                        .setEmoji(Icons.Configure)
                        .setCustomId("REALTIME_LOGS")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Error Lookup")
                        .setEmoji(Icons.Search)
                        .setCustomId("ERROR_LOOKUP")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Server Lookup")
                        .setEmoji(Icons.Search)
                        .setCustomId("GUILD_LOOKUP")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Subscriptions")
                        .setEmoji(Icons.Zap)
                        .setCustomId(ButtonIds.Subscriptions)
                        .setStyle(ButtonStyle.Secondary)
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Profile")
                        .setEmoji(Icons.Member)
                        .setCustomId(ButtonIds.Profiles)
                        .setStyle(ButtonStyle.Secondary)
                )
        ]

        const logs = await fs.readFileSync("./log.json");
        const raw = logs.toString().split("\n").filter(e => e != "").slice(-6);
        const ResolvedLogs: { level: number; msg: string; time: number; type: string; }[] = raw.map(e => ({
            ...JSON.parse(e),
            type: Logger.levels.labels[JSON.parse(e).level]
        }));
        await interaction.reply({
            content: `${codeBlock(`//[Showing past 6 log messages]\n\n${ResolvedLogs.map(e => `[${e.type}] ${e.msg}`).join("\n")}`)}`,
            //content: "```\n[Showing past 6 log messages]\n\n[Diagnostics] Getting emergency diagnostic ready...\n[Diagnostics] Attempting to restart systems...\n[Diagnostics] Restarting systems...\n[Diagnostics] DONE... Restarted system\n[Diagnostics] Showing diagnostic information...\n[Diagnostics] DONE...```",
            components: Buttons,
            ephemeral: true
        });
    }
}