import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { SendError } from "../utils/error";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

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
        const UserId = client.storage[`pending_${interaction.message.id}`];
        const User = await interaction.guild.members.fetch({
            user: UserId
        });
        const Channel = await User.createDM(true);

        if (Id == "ACCEPT") {
            try {
                await interaction.guild.members.unban(UserId, `${interaction.user} accepted the appeal`)
            } catch (e) {
                await SendError(interaction, e);
            }
            interaction.reply({
                embeds: [
                    new Embed()
                        .setTitle(`Member successfully unbanned.`)
                        .setAuthor({
                            iconURL: interaction.user.displayAvatarURL(),
                            name: interaction.user.username
                        })
                ]
            });

            const Invite = await interaction.guild.invites.create(
                //@ts-expect-error
                interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText).first(), {
                maxAge: 0,
                maxUses: 3
            });

            Channel.send({
                content: `${Emojis.Tada} Your appeal was accepted, you're now able to rejoin! ${Invite.url}`
            });
        } else if (Id == "DENY") {
            await interaction.showModal(
                new ModalBuilder()
                    .setTitle("Reason")
                    .setCustomId("SET_REASON_F25")
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setLabel("Reason")
                                    .setCustomId("REASON")
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Paragraph)
                            )
                    )
            )

            const ModalInteraction = await interaction.awaitModalSubmit({
                time: 0
            });

            const Reason = ModalInteraction.fields.getTextInputValue("REASON");
            ModalInteraction.reply({
                embeds: [
                    new Embed()
                        .setTitle(`Appeal denied.`)
                        .setDescription(`Reason:\n\n\`\`\`${Reason}\`\`\``)
                        .setAuthor({
                            iconURL: interaction.user.displayAvatarURL(),
                            name: interaction.user.username
                        })
                ]
            });

            Channel.send({
                content: `😢 Your appeal was denied, here's what I know:\n\n\`\`\`${Reason}\`\`\``
            });
        } else {
            interaction.reply({
                content: "Something didn't go quite right..."
            })
        }
    }
}