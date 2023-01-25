import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from "discord.js";
import { InteractionError } from "../../utils/error";
import { Embed, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";

export default class AppealButtons extends Button {
    constructor() {
        super({
            CustomId: "2RJ4JDWO_{any}",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: [],
            RequireIdFetching: true
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client, Id: "DENY" | "ACCEPT") {
        //await interaction.deferReply();
        const UserId = client.QuickStorage[`pending_${interaction.message.id}`];
        const User = await interaction.guild.members.fetch({
            user: UserId
        });
        const Channel = await User.createDM(true);

        if (Id == "ACCEPT") {
            try {
                await interaction.guild.members.unban(UserId, `${interaction.user.username} accepted the appeal`)
            } catch (e) {
                await InteractionError({
                    interaction,
                    createError: true,
                    ephemeral: false,
                    error: e
                });
            }

            await interaction.reply({
                embeds: [
                    await new Embed(interaction.guild)
                        .setTitle(`${Icons.Flag} Member successfully unbanned.`)
                        .setAuthor({
                            iconURL: interaction.user.displayAvatarURL(),
                            name: interaction.user.username
                        })
                        .Resolve()
                ]
            });

            const Invite = await interaction.guild.invites.create(
                //@ts-expect-error we can create invites in here
                interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText && e.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)).first(), {
                maxAge: 0,
                maxUses: 3
            });

            Channel.send({
                content: `${Icons.Flag} Your appeal was accepted, you're now able to rejoin! Here's an invite link: ${Invite.url}`
            });
        } else if (Id == "DENY") {
            const ModalId = "APPEAL_DENY_REASON";
            enum Fields {
                Reason = "DENY_REASON"
            }
            await interaction.showModal(
                new ModalBuilder()
                    .setTitle("Reason")
                    .setCustomId(ModalId)
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setLabel("Reason")
                                    .setCustomId(Fields.Reason)
                                    .setPlaceholder("Why did you deny their appeal? (this will be sent to them)")
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Paragraph)
                            )
                    )
            );

            const ModalInteraction = await interaction.awaitModalSubmit({
                time: 0
            });

            const Reason = ModalInteraction.fields.getTextInputValue(Fields.Reason);
            await ModalInteraction.reply({
                embeds: [
                    new Embed(interaction.guild)
                        .setTitle(`${Icons.TrashDefault} Appeal Denied`)
                        .setDescription(`Reason (sent to appeal user):\n\n\`\`\`${Reason}\`\`\``)
                        .addFields([{
                            name: `${Icons.Member} Denied By`,
                            value: `${interaction.user}`
                        }])
                        .setAuthor({
                            iconURL: interaction.user.displayAvatarURL(),
                            name: interaction.user.username
                        })
                ]
            });

            Channel.send({
                content: `${Icons.Flag} Your appeal was denied, here's what we know:\n\n\`\`\`${Reason}\`\`\``
            });
        } else {
            await interaction.reply({
                content: "Unknown button"
            })
        }
    }
}