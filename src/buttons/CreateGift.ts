import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, inlineCode, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
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
import { CreateGift } from "../utils/Gift";

export const CustomBrandingModal = "CUSTOM_BRANDING_MODAL";
export default class CustomBranding extends Button {
    constructor() {
        super({
            CustomId: "CREATE_GIFT",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        if (!ClientAdministators.includes(interaction.user.id)) return;
        const Gift = await CreateGift(interaction.user)
        await interaction.reply({
            ephemeral: true,
            content: `Gift Created: ${inlineCode(Gift.code)} (expires ${time(Gift.expires, TimestampStyles.RelativeTime)})`
        })
    }
}