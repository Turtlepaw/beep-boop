import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, Guild, Message, MessageActivityType, ModalBuilder, OAuth2Scopes, OverwriteType, PermissionFlagsBits, PermissionsString, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, TextBasedChannel, TextChannel, TextChannelResolvable, TextInputBuilder, TextInputStyle, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Emojis, Icons } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { GuildInformation, MemberInformation } from "../utils/info";
import { Endorse, FetchUser, ResolveUser, SetBio, SetDisplayName } from "../utils/Profile";
import e from "express";

export async function Lock(guild: Guild, channel: TextChannel) {
    await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: false
    });
}

export async function Unlock(guild: Guild, channel: TextChannel) {
    await channel.lockPermissions();
}

export const Permissions: PermissionsString[] = ["ManageMessages", "ManageChannels", "ManageGuild"];
export default class Channel extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Channel utils",
            GuildOnly: true,
            Name: "channel",
            RequiredPermissions: [],
            SomePermissions: Permissions,
            Category: Categories.Server,
            Subcomamnds: [
                new SlashCommandSubcommandBuilder()
                    .setName("lock")
                    .setDescription("Lock this channel up.")
                    .addStringOption(e =>
                        e.setName("reason")
                            .setDescription("The reason to appear on the message.")
                    ),
                new SlashCommandSubcommandBuilder()
                    .setName("unlock")
                    .setDescription("Restores the defualt permissions."),
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        enum Subcommands {
            Lock = "lock",
            Unlock = "unlock"
        };
        const Subcommand = interaction.options.getSubcommand() as Subcommands;

        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("UNLOCK_CHANNEL")
                    .setLabel("Unlock Channel")
                    .setEmoji(Icons.Unlock)
                    .setStyle(ButtonStyle.Secondary)
            );
        if (Subcommand == Subcommands.Lock) {
            const Reason = interaction.options.getString("reason");
            await Lock(interaction.guild, interaction.channel as TextChannel);

            await interaction.reply({
                embeds: [
                    new Embed()
                        .setTitle(`${Icons.Lock} This channel has been locked.`)
                        .setAuthor({
                            name: `Locked by ${interaction.user.username}`,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(Reason || "This channel has been locked by moderators.")
                ],
                components: [ActionButtons]
            });
        } else if (Subcommand == Subcommands.Unlock) {
            await Unlock(interaction.guild, interaction.channel as TextChannel);
            await interaction.reply({
                embeds: [
                    new Embed()
                        .setTitle(`${Icons.Unlock} This channel has been unlocked.`)
                        .setAuthor({
                            name: `Unlocked by ${interaction.user.username}`,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription("This channel has been unlocked by moderators.")
                ],
                /*components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            ActionButtons.components.map(e => e.setDisabled(true))
                        )
                ]*/
            });
        }
    }
}