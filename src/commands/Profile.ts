import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, InteractionType, Message, MessageActivityType, ModalBuilder, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle, User, UserContextMenuCommandInteraction, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Emojis, Icons } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { GuildInformation, MemberInformation } from "../utils/info";
import { Endorse, FetchUser, ResolveUser, SetBio, SetDisplayName } from "../utils/Profile";
import { Subscriptions } from "../models/Profile";

export async function ViewProfile(interaction: UserContextMenuCommandInteraction | ChatInputCommandInteraction, ephemeral: boolean = true, user?: User) {
    if (user == null && interaction.isContextMenuCommand()) user = interaction.targetUser;
    const { client } = interaction;
    const profile = await ResolveUser(user.id, client);
    const Badges = {
        Pro: Icons.ProUser
    }
    const OwnedBadges = [
        ...(profile.subscription == Subscriptions.Pro ? [Badges.Pro] : [])
    ]

    const Message = await interaction.reply({
        ephemeral,
        fetchReply: true,
        embeds: [
            new Embed(interaction.guild)
                .setTitle(`${profile.displayName}'s Profile`)
                .setColor(profile.accentColor)
                .setThumbnail(user.avatarURL())
                .addFields([{
                    name: `About me`,
                    value: profile.bio
                }, {
                    name: `Reputation (endorsements)`,
                    value: profile.reputation.toString()
                }, {
                    name: "Badges",
                    value: `${OwnedBadges.length <= 0 ? "None." : OwnedBadges.join(" ")}`
                }])
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji(Emojis.Help)
                        .setCustomId("INFO")
                        .setStyle(ButtonStyle.Secondary)
                )
        ]
    });

    const Collector = Message.createMessageComponentCollector({
        time: 0,
        max: 0,
        componentType: ComponentType.Button
    });

    Collector.on('collect', async button => {
        if (button.customId == "INFO") {
            await button.reply({
                ephemeral: true,
                content: `**${Emojis.Help} Endorsements FAQ**\nEndorsements are used to verify that you're not a bot or a spammer, in some communities, you're required to have a certain amount of endorsements to join. When you help people you might get endorsed, and you can also endorse other users that you know.`
            });
        }
    });
}

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information.",
            GuildOnly: false,
            Name: "profile",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Profiles,
            Subcomamnds: [
                new SlashCommandSubcommandBuilder()
                    .setName("view")
                    .setDescription("View someone's profile.")
                    .addUserOption(e =>
                        e.setName("member")
                            .setDescription("The member's profile to view.")
                    )
                    .addBooleanOption(e =>
                        e.setName("hidden")
                            .setDescription("Make the reply visible only to you and hidden to everyone else.")
                    ),
                new SlashCommandSubcommandBuilder()
                    .setName("endorse")
                    .setDescription("Endorse a member for helping you out.")
                    .addUserOption(e =>
                        e.setName("member")
                            .setDescription("The member's profile to endorse.")
                            .setRequired(true)
                    )
                    .addBooleanOption(e =>
                        e.setName("hidden")
                            .setDescription("Make the reply visible only to you and hidden to everyone else.")
                    ),
                new SlashCommandSubcommandBuilder()
                    .setName("customimize")
                    .setDescription("Customize your profile!")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        enum Subcommands {
            View = "view",
            Endorse = "endorse",
            Customimize = "customimize"
        };
        const Subcommand = interaction.options.getSubcommand() as Subcommands;
        const user = interaction.options.getUser("member") || interaction.user;
        const ephemeral = interaction.options.getBoolean("hidden", false) || true;

        if (Subcommand == Subcommands.View) {
            ViewProfile(interaction, ephemeral, user);
        } else if (Subcommand == Subcommands.Endorse) {
            if (user.id == interaction.user.id) return FriendlyInteractionError(interaction, "You can't endorse yourself.")
            Endorse(user.id, client);

            const payload = {
                content: `${Icons.MemberAdd} ${interaction.user} endorsed you.`
            }

            try {
                const DM = await user.createDM(true);
                DM.send(payload);
            } catch {
                interaction.channel.send(payload)
            }

            await interaction.reply({
                ephemeral,
                content: `${Icons.Success} You endorsed ${user}!`
            })
        } else if (Subcommand == Subcommands.Customimize) {
            enum Id {
                AboutMe = "EDIT_ABOUT_ME",
                DisplayName = "SET_DISPLAY_NAME",
                AboutMeModal = "ABOUT_ME_MODAL",
                DisplayNameModal = "DISPLAY_NAME_MODAL",
                Text = "MODAL_TEXT"
            }
            const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Edit About Me")
                        .setCustomId(Id.AboutMe)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setLabel("Edit Display Name")
                        .setCustomId(Id.DisplayName)
                        .setStyle(ButtonStyle.Primary)
                );

            const Profile = await ResolveUser(interaction.user.id, client);
            const AboutMeText = new TextInputBuilder()
                .setCustomId(Id.Text)
                .setLabel("Text")
                .setMinLength(2)
                .setMaxLength(190)
                .setPlaceholder("An awesome about me...")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);
            const DisplayNameText = new TextInputBuilder()
                .setCustomId(Id.Text)
                .setLabel("Text")
                .setMinLength(2)
                .setMaxLength(32)
                .setPlaceholder("Awesome User")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);
            if (Profile?.bio != null) AboutMeText.setValue(Profile.bio);
            if (Profile?.displayName != null) DisplayNameText.setValue(Profile.displayName);
            const AboutMeModal = new ModalBuilder()
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            AboutMeText
                        )
                )
                .setTitle("About Me")
                .setCustomId(Id.AboutMeModal);
            const DisplayNameModal = new ModalBuilder()
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            DisplayNameText
                        )
                )
                .setTitle("Display Name")
                .setCustomId(Id.DisplayNameModal);

            const Message = await interaction.reply({
                ephemeral,
                fetchReply: true,
                components: [ActionButtons],
                embeds: [
                    new Embed(interaction.guild)
                        .setTitle("Customizing your profile")
                        .setDescription("Select an option below to start customizing your profile!")
                ]
            });

            const Collector = Message.createMessageComponentCollector({
                time: 0,
                max: 0,
                componentType: ComponentType.Button
            });

            Collector.on('collect', async button => {
                if (button.customId == Id.AboutMe) {
                    await button.showModal(AboutMeModal)
                } else if (button.customId == Id.DisplayName) {
                    await button.showModal(DisplayNameModal);
                }

                const Modal = await button.awaitModalSubmit({
                    time: 0
                });

                const text = Modal.fields.getTextInputValue(Id.Text);
                let type: string;
                if (button.customId == Id.AboutMe) {
                    SetBio(interaction.user.id, text, client);
                    type = "about me"
                } else if (button.customId == Id.DisplayName) {
                    SetDisplayName(interaction.user.id, text, client);
                    type = "display name"
                }

                await Modal.reply({
                    ephemeral: true,
                    content: `${Icons.Success} Set your ${type}, it should show up next time you see your profile.`
                });
            });
        }
    }
}