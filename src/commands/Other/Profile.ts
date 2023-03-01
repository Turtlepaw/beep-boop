import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, ComponentType, ModalBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle, User, UserContextMenuCommandInteraction } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { Colors, Embed, Emojis, Icons, Logs, TeamRole } from "@config";
import { FriendlyInteractionError } from "../../utils/error";
import { Endorse, ResolveUser, SetAccentColor, SetBio, SetDisplayName } from "../../utils/Profile";
import { Subscriptions } from "../../models/Profile";
import { MAX_REPUTATION_UPVOTE, STAFF_REPUTATION } from "@constants";

export async function ViewProfile(interaction: UserContextMenuCommandInteraction | ChatInputCommandInteraction, ephemeral = true, user?: User) {
    if (user == null && interaction.isContextMenuCommand()) user = interaction.targetUser;
    const { client } = interaction;
    const profile = await ResolveUser(user.id, client);
    const Badges = {
        Pro: Icons.ProUser,
        Team: Icons.AirdotTeam
    }

    const Guild = await client.guilds.fetch(Logs.Guild);
    const Role = await Guild.roles.fetch(TeamRole);

    const OwnedBadges = [
        ...(profile.subscription != Subscriptions.None ? [Badges.Pro] : []),
        ...(Role.members.has(user.id) ? [Badges.Team] : [])
    ];

    const Message = await interaction.reply({
        ephemeral,
        fetchReply: true,
        embeds: [
            new Embed(interaction)
                .setTitle(`${profile.displayName}'s Profile`)
                .setColor(profile.accentColor ?? Colors.Transparent)
                .setThumbnail(user.avatarURL())
                .addFields([{
                    name: `About me`,
                    value: profile.bio
                }, {
                    name: `Reputation (endorsements)`,
                    value: profile.reputation.toString()
                }, {
                    name: "Badges",
                    value: `${OwnedBadges.length <= 0 ? "None" : OwnedBadges.join(" ")}`
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

export async function EndorseUser(user: User, ephemeral = true, interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction) {
    const { client } = interaction;
    const current = await ResolveUser(interaction.user.id, client);
    if (current.reputation < MAX_REPUTATION_UPVOTE) return interaction.reply({
        content: `${Icons.Shield} You must have a reputation of ${MAX_REPUTATION_UPVOTE.toString()} or more to endorse someone.`,
        ephemeral: true
    });
    if (user.id == interaction.user.id) return FriendlyInteractionError(interaction, "You can't endorse yourself.")
    Endorse(user.id, client);

    try {
        const payload = {
            content: `${Icons.MemberAdd} ${interaction.user} endorsed you.`
        }

        const DM = await user.createDM(true);
        DM.send(payload);
    } catch {
        const payload = {
            content: `${Icons.MemberAdd} ${user}, ${interaction.user} endorsed you.`
        }
        interaction.channel.send(payload)
    }

    await interaction.reply({
        ephemeral,
        content: `${Icons.Success} You endorsed ${user}!`
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
            Subcommands: [
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
        }
        const Subcommand = interaction.options.getSubcommand() as Subcommands;
        const user = interaction.options.getUser("member") || interaction.user;
        const ephemeral = interaction.options.getBoolean("hidden", false) || true;

        if (Subcommand == Subcommands.View) {
            return ViewProfile(interaction, ephemeral, user);
        } else if (Subcommand == Subcommands.Endorse) {
            return EndorseUser(user, ephemeral, interaction);
        } else if (Subcommand == Subcommands.Customimize) {
            enum Id {
                AboutMe = "EDIT_ABOUT_ME",
                DisplayName = "SET_DISPLAY_NAME",
                AccentColor = "SET_ACCENT_COLOR",
                AboutMeModal = "ABOUT_ME_MODAL",
                DisplayNameModal = "DISPLAY_NAME_MODAL",
                AccentColorModal = "ACCENT_COLOR_MODAL",
                Text = "MODAL_TEXT"
            }
            const Profile = await ResolveUser(interaction.user.id, client);

            const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Edit About Me")
                        .setCustomId(Id.AboutMe)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Edit Display Name")
                        .setCustomId(Id.DisplayName)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel("Edit Accent Color")
                        .setCustomId(Id.AccentColor)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(Profile.subscription == Subscriptions.None)
                );

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
            const AccentColorText = new TextInputBuilder()
                .setCustomId(Id.Text)
                .setLabel("Accent Color")
                .setMinLength(7)
                .setMaxLength(9)
                .setPlaceholder("#5865F2")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            if (Profile?.bio != null) AboutMeText.setValue(Profile.bio);
            if (Profile?.displayName != null) DisplayNameText.setValue(Profile.displayName);
            if (Profile?.accentColor != null) AccentColorText.setValue(Profile.accentColor.toString());
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
            const AccentColorModal = new ModalBuilder()
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            AccentColorText
                        )
                )
                .setTitle("Accent Color")
                .setCustomId(Id.AccentColorModal);

            const Message = await interaction.reply({
                ephemeral,
                fetchReply: true,
                components: [ActionButtons],
                embeds: [
                    new Embed(interaction)
                        .setTitle("Customizing your profile")
                        .setDescription("Select an option below to start customizing your profile!")
                ]
            });

            const Guild = await client.guilds.fetch(Logs.Guild);
            const Role = await Guild.roles.fetch(TeamRole);
            if (Role.members.has(interaction.user.id) && Profile.reputation < STAFF_REPUTATION) {
                await Endorse(interaction.user.id, client, STAFF_REPUTATION);
                interaction.followUp({
                    ephemeral: true,
                    content: `${Icons.Shield} Since your part of the Airdot Team, you've automatically gained ${STAFF_REPUTATION} reputation.`
                })
            }

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
                } else if (button.customId == Id.AccentColor) {
                    await button.showModal(AccentColorModal);
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
                } else if (button.customId == Id.AccentColor) {
                    SetAccentColor(interaction.user.id, text, client);
                    type = "accent color"
                }

                await Modal.reply({
                    ephemeral: true,
                    content: `${Icons.Success} Set your ${type}, it should show up next time you see your profile.`
                });
            });
        }
    }
}