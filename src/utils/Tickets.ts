import { GenerateTranscriptionURL } from "../configuration";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildBasedChannel } from "discord.js";

export enum TicketButton {
    CloseTicket = "CLOSE_TICKET",
    ClaimTicket = "CLAIM_TICKET"
}

export function TicketButtons(Channel: GuildBasedChannel, claimed = false) {
    return [
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Share conversation")
                    .setStyle(ButtonStyle.Link)
                    .setURL(GenerateTranscriptionURL(Channel.guildId, Channel.id)),
                new ButtonBuilder()
                    .setLabel("Close")
                    .setStyle(ButtonStyle.Danger)
                    //.setEmoji("🔒")
                    .setCustomId("CLOSE_TICKET"),
                new ButtonBuilder()
                    .setLabel("Claim")
                    .setStyle(ButtonStyle.Success)
                    //.setEmoji("🔍")
                    .setCustomId("CLAIM_TICKET")
                    .setDisabled(claimed)
            )
    ]
}