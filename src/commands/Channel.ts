import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Guild, PermissionFlagsBits, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons, Permissions } from "../configuration";

export async function Lock(guild: Guild, channel: TextChannel) {
    await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: false
    });
}

export async function Unlock(guild: Guild, channel: TextChannel) {
    await channel.lockPermissions();
}

export default class Channel extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Lock the server or a channel.",
            GuildOnly: true,
            Name: "lock",
            RequiredPermissions: [],
            SomePermissions: Permissions.Moderator,
            Category: Categories.Server,
            ClientPermissions: [PermissionFlagsBits.ManageChannels],
            Subcommands: [
                new SlashCommandSubcommandBuilder()
                    .setName("channel")
                    .setDescription("Lock this channel.")
                    .addStringOption(e =>
                        e.setName("reason")
                            .setDescription("The reason to appear on the message.")
                    ),
                new SlashCommandSubcommandBuilder()
                    .setName("remove")
                    .setDescription("Restores the defualt permissions."),
                /*new SlashCommandSubcommandBuilder()
                    .setName("server")
                    .setDescription("Locks the whole server.")
                    .addStringOption(e =>
                        e.setName("reason")
                            .setDescription("The reason to appear on the message.")
                    )
                    .addBooleanOption(e =>
                        e.setName("exclude_private_channels")
                            .setDescription("Exclude private channels from being locked. (e.g. moderator only channels)")
                    ),*/
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        enum Subcommands {
            Lock = "channel",
            Unlock = "remove",
            LockServer = "server"
        }
        const Subcommand = interaction.options.getSubcommand() as Subcommands;

        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("UNLOCK_CHANNEL")
                    .setLabel("Unlock Channel")
                    .setEmoji(Icons.Unlock)
                    .setStyle(ButtonStyle.Secondary)
            );
        if (Subcommand == Subcommands.LockServer) {
            const ExcludePrivateChannels = interaction.options.getBoolean("exclude_private_channels");
            const Channels = await interaction.guild.channels.fetch();
            const ResolvedChannels = Channels.filter(e => {
                if (ExcludePrivateChannels && !e.permissionsFor(interaction.guild.roles.everyone).has(PermissionFlagsBits.ViewChannel)) {
                    return false;
                } else if (e.type == ChannelType.GuildCategory) {
                    return false;
                } else return true;
            });

            for (const Channel of ResolvedChannels.values()) {
                if (![ChannelType.GuildText, ChannelType.GuildVoice].includes(Channel.type)) return;
                Lock(interaction.guild, Channel as TextChannel);
            }

            await interaction.reply({
                content: `${Icons.Channel} Locked ${ResolvedChannels.size} channels.`,
                ephemeral: true
            });
        } else if (Subcommand == Subcommands.Lock) {
            const Reason = interaction.options.getString("reason");
            await Lock(interaction.guild, interaction.channel as TextChannel);

            await interaction.reply({
                embeds: [
                    new Embed(interaction.guild)
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
                    new Embed(interaction.guild)
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