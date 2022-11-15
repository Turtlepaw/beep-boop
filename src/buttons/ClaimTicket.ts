import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../utils/Id";
import { Ticket } from "./CreateTicket";

export default class ClaimTicket extends Button {
    constructor() {
        super({
            CustomId: "CLAIM_TICKET",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["ManageChannels", "KickMembers", "ManageMessages", "BanMembers"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await interaction.update({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Close")
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("🔒")
                            .setCustomId("CLOSE_TICKET"),
                        new ButtonBuilder()
                            .setLabel("Claim")
                            .setStyle(ButtonStyle.Success)
                            .setEmoji("🔍")
                            .setCustomId("CLAIM_TICKET")
                            .setDisabled(true)
                    )
            ],
            embeds: [
                new EmbedBuilder(interaction.message.embeds[0].data)
                    .setFields([
                        ...interaction.message.embeds[0].data.fields.filter(e => e.name != "Claimed By"), {
                            name: "Claimed By",
                            value: interaction.user.toString(),
                            inline: true
                        }
                    ])
            ]
        });

        await interaction.followUp({
            content: `🔍 ${interaction.user} has claimed the ticket.`
        })
    }
}