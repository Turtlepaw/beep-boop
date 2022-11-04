import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { SendError } from "../error";
import { Verifiers } from "../verify";
import { SendAppealMessage } from "../appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../Id";
import { Ticket } from "./CreateTicket";

export default class TestAppeals extends Button {
    constructor() {
        super({
            CustomId: "CLAIM_TICKET",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["ManageChannels", "KickMembers", "ManageMessages", "BanMembers"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await interaction.reply({
            content: `🔍 ${interaction.user} has claimed the ticket.`
        })
    }
}