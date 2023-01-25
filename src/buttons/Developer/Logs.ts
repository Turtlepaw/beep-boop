import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, codeBlock, ComponentType } from "discord.js";
import { ClientAdministrators } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { Logger } from "../../logger";
import fs from "fs";

export default class RealtimeLogs extends Button {
    constructor() {
        super({
            CustomId: "REALTIME_LOGS",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        if (!ClientAdministrators.includes(interaction.user.id)) return;

        interface LogMessage { level: number; msg: string; time: number; type: string; }
        const ResolveLogs = (expand = false) => {
            const logs = fs.readFileSync("./log.json");
            const raw = logs.toString().split("\n").filter(e => e != "").slice(expand ? -15 : -6);
            const ResolvedLogs: LogMessage[] = raw.map(e => ({
                ...JSON.parse(e),
                type: Logger.levels.labels[JSON.parse(e).level]
            }));
            return ResolvedLogs;
        };

        let expanded = false;
        const TextFrom = (logs: LogMessage[]) => `${codeBlock("json", `//[Showing past ${expanded ? "15" : "6"} log messages]\n\n${logs.map(e => `[${e.type}] ${e.msg}`).join("\n")}`)}`

        const components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Refresh")
                        .setCustomId("REFRESH")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setLabel(expanded ? "Close" : "Expand")
                        .setCustomId("EXPAND")
                        .setStyle(ButtonStyle.Secondary)
                )
        ]
        const Message = await interaction.reply({
            content: TextFrom(ResolveLogs()),
            ephemeral: true,
            fetchReply: true,
            components: [
                ...components()
            ]
        });

        const collector = Message.createMessageComponentCollector({
            time: 0,
            componentType: ComponentType.Button
        });

        collector.on("collect", async button => {
            if (button.customId == "REFRESH") {
                button.update({
                    content: TextFrom(ResolveLogs(expanded))
                });
            } else if (button.customId == "EXPAND") {
                expanded = !expanded;
                button.update({
                    content: TextFrom(ResolveLogs(expanded)),
                    components: [
                        ...components()
                    ]
                });
            }
        });
    }
}