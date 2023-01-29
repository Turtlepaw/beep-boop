import { ButtonInteraction, Client, inlineCode, time, TimestampStyles } from "discord.js";
import { FriendlyInteractionError } from "../../utils/error";
import { ClientAdministrators, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { CreateGift } from "../../utils/Gift";
import { Subscriptions } from "../../models/Profile";
import { StringSelectBuilder, StringSelector } from "../../utils/components";
import { LogSnagChannels } from "../../@types/logsnag";

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
        const GiftTypeSelector = new StringSelector()
            .AddOptions(
                new StringSelectBuilder()
                    .setLabel("Basic")
                    .setValue(Subscriptions.Basic),
                new StringSelectBuilder()
                    .setLabel("Pro")
                    .setValue(Subscriptions.Pro)
            )
            .SetCustomId("SELECT_TYPE")
            .Configure(e => e.setMaxValues(1));

        await interaction.editReply({
            content: `${Icons.Gift} Select a gift type.`,
            components: GiftTypeSelector.toComponents()
        });

        const Type = await GiftTypeSelector.CollectComponents(Message, interaction);

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

        await Type.update({
            content: `${Icons.Date} Pick how long the gift's subscription should last.`,
            components: Datepicker.toComponents()
        })

        const Datepick = await Datepicker.CollectComponents(Message, interaction);

        const Gift = await CreateGift(
            interaction.user,
            Subscriptions[GetSubscriptionName(Type.values[0])],
            new Date(Date.now() + Number(Datepick.values[0]))
        );

        await Datepick.update({
            components: [],
            content: `${Icons.Gift} ${GetSubscriptionName(Type.values[0])} Gift Created: ${inlineCode(Gift.code)} (expires ${time(Gift.expires, TimestampStyles.RelativeTime)})`
        });

        await client.LogSnag.publish({
            channel: LogSnagChannels.Gifts,
            event: "Gift Created",
            description: `${interaction.user.tag} created ${Gift.code}`,
            icon: "🎁",
            tags: {
                user: interaction.user.tag
            }
        });
    }
}
