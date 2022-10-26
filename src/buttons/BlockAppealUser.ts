import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class AddBirthday extends Button {
    constructor() {
        super({
            CustomId: "BLOCK_{any}",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client, Id: string) {
        const UserId = Id;
        const User = await interaction.guild.members.fetch({
            user: UserId
        });

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
                    .setFields([{
                        name: "User Blocked",
                        value: User.user.tag
                    }])
                    .setTitle(`User blocked.`)
                    .setDescription(`Reason:\n\n\`\`\`${Reason}\`\`\``)
                    .setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: interaction.user.username
                    })
            ]
        });

        client.storage["blocked"] = [
            Id,
            ...client.storage["blocked"]
        ];

        User.dmChannel.send({
            content: `😢 You've been blocked from appealing, here's what I know:\n\n\`\`\`${Reason}\`\`\``
        });
    }
}