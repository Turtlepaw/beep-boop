import { ActionRow, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, ImageFormat, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption, time, TimestampStyles, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Colors, Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { ResolveUser } from "../utils/Profile";
import { Subscriptions } from "../models/Profile";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Manage your pro subscription.",
            GuildOnly: false,
            Name: "pro",
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
                            name: "Expires",
                            value: time(ExpiresIn, TimestampStyles.RelativeTime)
                        }])
                        .setColor(Colors.SuccessButton)
                        .setTitle("Your Subscription")
                ],
                ephemeral: true,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Activate Custom Branding")
                                .setCustomId("CUSTOM_BRANDING")
                                .setStyle(ButtonStyle.Success),
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