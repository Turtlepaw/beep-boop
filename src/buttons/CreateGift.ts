import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, inlineCode, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
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
import { Subscriptions } from "../models/Profile";

export function GetSubscriptionName(name: Subscriptions | string) {
    return Object.entries(Subscriptions).find(e => e[1] == name)[0]
}
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
        const Message = await interaction.reply({
            ephemeral: true,
            fetchReply: true,
            content: "Select a gift type.",
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setMaxValues(1)
                            .setCustomId("SELECT_TYPE")
                            .setOptions(
                                new SelectMenuOptionBuilder()
                                    .setLabel("Basic")
                                    .setValue(Subscriptions.Basic),
                                new SelectMenuOptionBuilder()
                                    .setLabel("Pro")
                                    .setValue(Subscriptions.Pro)
                            )
                    )
            ]
        });

        const Type = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.StringSelect
        });

        const Gift = await CreateGift(interaction.user, Subscriptions[GetSubscriptionName(Type.values[0])])
        await Type.update({
            components: [],
            content: `${GetSubscriptionName(Type.values[0])} Gift Created: ${inlineCode(Gift.code)} (expires ${time(Gift.expires, TimestampStyles.RelativeTime)})`
        });
    }
}