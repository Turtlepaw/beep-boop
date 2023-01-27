import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, GuildBasedChannel, ModalBuilder, NewsChannel, PermissionFlagsBits, StageChannel, TextChannel, TextInputBuilder, TextInputStyle, VoiceChannel, codeBlock, inlineCode } from "discord.js";
import { ClientAdministrators, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { GuildInformation } from "../../utils/info";
import { Logger } from "../../logger";

type InvitableChannel = TextChannel | VoiceChannel | NewsChannel | StageChannel;
function isInvitable(channel: GuildBasedChannel): channel is InvitableChannel {
    if ([
        ChannelType.GuildText,
        ChannelType.GuildVoice,
        ChannelType.GuildAnnouncement,
        ChannelType.GuildStageVoice
    ].includes(channel.type)) return true;
    else return false;
}

export default class GuildLookup extends Button {
    constructor() {
        super({
            CustomId: "GUILD_LOOKUP",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        if (!ClientAdministrators.includes(interaction.user.id)) return;

        enum Fields {
            GuildId = "GUILD_ID"
        }

        const Modal = new ModalBuilder()
            .setCustomId("GUILD_LOOKUP_MODAL")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(Fields.GuildId)
                            .setLabel("Guild Id")
                            .setPlaceholder("1049143063978709063")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    )
            )
            .setTitle("Guild Lookup");

        await interaction.showModal(Modal);
        const modal = await interaction.awaitModalSubmit({
            time: 0
        });

        const guild = await client.guilds.fetch(
            modal.fields.getTextInputValue(Fields.GuildId)
        );

        if (guild == null) return await modal.reply({
            ephemeral: true,
            content: `${Icons.Search} That guild doesn't seem to exist`
        });

        enum Buttons {
            LeaveGuild = "LEAVE_GUILD",
            GenerateInvite = "GENERATE_INVITE"
        }

        const Message = await GuildInformation(modal, guild, true, [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Generate Invite")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(Icons.Link)
                        .setCustomId(Buttons.GenerateInvite),
                    new ButtonBuilder()
                        .setLabel("Leave")
                        .setCustomId(Buttons.LeaveGuild)
                        .setEmoji(Icons.RoleRemove)
                        .setStyle(ButtonStyle.Secondary)
                )
        ]);

        const btn = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0
        });

        if (btn.customId == Buttons.GenerateInvite) {
            const channels = await guild.channels.fetch();
            const channel = channels.filter(e => isInvitable(e) && e.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)).first() as TextChannel;
            const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            await btn.reply({
                content: `${Icons.Link} Created an invite in ${inlineCode(`#${invite.channel.name}`)}: ${invite.url}`,
                ephemeral: true
            });
        } else if (btn.customId == Buttons.LeaveGuild) {
            try {
                guild.leave();
                await btn.reply({
                    content: `${Icons.RoleRemove} I've successfully left ${guild.name}`,
                    ephemeral: true
                });
            } catch (e) {
                Logger.error(`Couldn't leave guild (${guild.name}): ${e}`);
                await btn.reply({
                    content: `${Icons.Info} Uh oh... We couldn't create an invite:\n\n${codeBlock(e)}`,
                    ephemeral: true
                });
            }
        }
    }
}