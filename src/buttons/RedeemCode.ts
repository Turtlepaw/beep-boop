import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis, GenerateTranscriptionURL } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../utils/Id";
import { Ticket } from "./CreateTicket";
import { Filter } from "../utils/filter";
import { CreateLinkButton } from "../utils/buttons";

export const RedeemCodeModal = "REDEEM_CODE_MODAL";
export default class RedeemCode extends Button {
    constructor() {
        super({
            CustomId: "REDEEM_CODE",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await interaction.showModal(
            new ModalBuilder()
                .setTitle("Redeem Code")
                .setCustomId(RedeemCodeModal)
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId("CODE")
                                .setLabel("Code")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder("WUMP-CODE-HERE")
                                .setMinLength(14)
                                .setMaxLength(14)
                        )
                )
        );
    }
}