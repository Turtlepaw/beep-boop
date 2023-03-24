import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, time, TimestampStyles } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { Embed, Icons, SupportServerInvite } from "../../configuration";
import { ResolveUser } from "../../utils/Profile";
import { Subscriptions } from "../../models/Profile";
import { GetSubscriptionName } from "../../buttons/Developer/CreateGift";

export default class Subscription extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Manage your pro subscription.",
            GuildOnly: false,
            Name: "subscription",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Images,
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        const Profile = await ResolveUser(interaction.user.id, client);

        if (Profile.subscription != null && Profile.subscription != Subscriptions.None) {
            const ExpiresIn = Profile.expires;
            await interaction.reply({
                embeds: [
                    new Embed(interaction)
                        .addFields([{
                            name: `${Icons.Clock} Expires`,
                            value: time(ExpiresIn, TimestampStyles.RelativeTime)
                        }, {
                            name: `${Icons.Discover} Subscription Tier`,
                            value: `${GetSubscriptionName(Profile.subscription)}`
                        }, {
                            name: `${Icons.Info} Subscriptions are in early access`,
                            value: `Pro and Basic subscriptions are currently in early access, provide feedback in our [support server](${SupportServerInvite}).`
                        }])
                        .setTitle("Your Subscription")
                ],
                ephemeral: true,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Custom Branding")
                                .setCustomId("CUSTOM_BRANDING")
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setLabel("Manage Servers")
                                .setCustomId("SUBSCRIPTION_GUILDS")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("Redeem Gift")
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId("REDEEM_CODE"),
                            new ButtonBuilder()
                                .setLabel("Learn More")
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://bop.trtle.xyz/pro"),
                            new ButtonBuilder()
                                .setLabel("Manage Subscription")
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://bop.trtle.xyz/manage")
                        )
                ]
            });
        } else {
            await interaction.reply({
                ephemeral: true,
                content: `${Icons.Flag} You don't have a pro subscription, you can still redeem gifts though.`,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Redeem Gift")
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId("REDEEM_CODE")
                        )
                ]
            })
        }
    }
}