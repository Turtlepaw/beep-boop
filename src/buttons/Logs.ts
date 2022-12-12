import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, codeBlock, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, inlineCode, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { SendAppealMessage } from "../utils/appeals";
import { ClientAdministators, Embed, Emojis, GenerateTranscriptionURL } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../utils/Id";
import { Ticket } from "./CreateTicket";
import { Filter } from "../utils/filter";
import { CreateLinkButton } from "../utils/buttons";
import { Logger } from "../logger";
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

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        if (!ClientAdministators.includes(interaction.user.id)) return;

        interface LogMessage { level: number; msg: string; time: number; type: string; };
        const ResolveLogs = (expand: boolean = false) => {
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