import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class AddBirthday extends Button {
    constructor() {
        super({
            CustomId: "APPEALBTN_{any}",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client, Id: "DENY" | "ACCEPT") {
        const UserId = client.storage[`pending_${interaction.message.id}`];
        const User = await interaction.guild.members.fetch({
            user: UserId
        });

        if (Id == "ACCEPT") {
            interaction.guild.members.unban(UserId, `${interaction.user} accepted the appeal`);
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

            User.dmChannel.send({
                content: `${Emojis.Tada} Your appeal was accepted, you're now able to rejoin! ${interaction.guild.invites.create(
                    //@ts-expect-error
                    interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText).first(), {
                    maxAge: 0,
                    maxUses: 3
                }
                )}`
            });
        } else if (Id == "DENY") {
            await interaction.showModal(
                new ModalBuilder()
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

            User.dmChannel.send({
                content: `😢 Your appeal was denied, here's what I know:\n\n\`\`\`${Reason}\`\`\``
            });
        }
    }
}