import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, inlineCode, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { SendAppealMessage } from "../utils/appeals";
import { ClientAdministrators, Embed, Emojis, GenerateTranscriptionURL, Icons } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../utils/Id";
import { Ticket } from "./CreateTicket";
import { Filter } from "../utils/filter";
import { CreateLinkButton } from "../utils/buttons";
import { CreateGift } from "../utils/Gift";
import { Subscriptions } from "../models/Profile";
import { StringSelectBuilder, StringSelector } from "../utils/components";
import ms from "ms";

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
        const Message = await interaction.deferReply({ ephemeral: true, fetchReply: true });
        if (!ClientAdministrators.includes(interaction.user.id)) return FriendlyInteractionError(interaction, "You're not authorized to use this.");
        await interaction.editReply({
            content: `${Icons.Gift} Select a gift type.`,
            components: [
                new StringSelector()
                    .AddOptions(
                        new StringSelectBuilder()
                            .setLabel("Basic")
                            .setValue(Subscriptions.Basic),
                        new StringSelectBuilder()
                            .setLabel("Pro")
                            .setValue(Subscriptions.Pro)
                    )
                    .SetCustomId("SELECT_TYPE")
                    .Configure(e => e.setMaxValues(1))
                    .toActionRow()
            ]
        });

        const Type = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.StringSelect
        });

        const Datepicker = new StringSelector()
            .AddOptions(
                new StringSelectBuilder()
                    .setLabel("In 2 months")
                    .setValue("5259492000"),
                new StringSelectBuilder()
                    .setLabel("In 5 months")
                    .setValue("13148730000"),
                new StringSelectBuilder()
                    .setLabel("In a year")
                    .setValue("31556952000"),
                new StringSelectBuilder()
                    .setLabel("In 2 years")
                    .setValue("63113904000"),
                new StringSelectBuilder()
                    .setLabel("In 100 years (lifetime)")
                    .setValue("3155695200000"),
            )
            .SetCustomId("SELECT_DATE")
            .Configure(e => e.setMaxValues(1));

        const DateReply = await Type.update({
            content: `${Icons.Date} Pick how long the gift's subscription should last.`,
            components: [Datepicker.toActionRow()]
        })

        const Datepick = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.StringSelect
        });

        const Gift = await CreateGift(
            interaction.user,
            Subscriptions[GetSubscriptionName(Type.values[0])],
            new Date(Date.now() + Number(Datepick.values[0]))
        );

        await Datepick.update({
            components: [],
            content: `${Icons.Gift} ${GetSubscriptionName(Type.values[0])} Gift Created: ${inlineCode(Gift.code)} (expires ${time(Gift.expires, TimestampStyles.RelativeTime)})`
        });
    }
}
