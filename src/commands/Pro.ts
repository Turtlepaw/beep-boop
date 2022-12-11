import { ActionRow, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, ImageFormat, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption, time, TimestampStyles, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Colors, Embed, Emojis, Icons, SupportServerInvite } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { ResolveUser } from "../utils/Profile";
import { Subscriptions } from "../models/Profile";
import { GetSubscriptionName } from "../buttons/CreateGift";

export default class Send extends Command {
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

        if (Profile.subscription == Subscriptions.Pro) {
            const ExpiresIn = Profile.expires;
            await interaction.reply({
                embeds: [
                    new Embed()
                        .addFields([{
                            name: `${Icons.Clock} Expires`,
                            value: time(ExpiresIn, TimestampStyles.RelativeTime)
                        }, {
                            name: `${Icons.Discover} Subscription Tier`,
                            value: `${GetSubscriptionName(Profile.subscription)}`
                        }, {
                            name: `${Icons.Info} Pro is in early access`,
                            value: `Pro is currently in early access, provide feedback in our [support server](${SupportServerInvite}).`
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
                                .setLabel("Redeem Code")
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
                content: "You don't have a pro subscription.",
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Redeem Code")
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId("REDEEM_CODE")
                        )
                ]
            })
        }
    }
}