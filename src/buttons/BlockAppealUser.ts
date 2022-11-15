import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class BlockAppealUser extends Button {
    constructor() {
        super({
            CustomId: "BLOCK_{any}",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: [],
            RequireIdFetching: true
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client, Id: string) {
        const UserId = Id;
        const User = await interaction.guild.members.fetch({
            user: UserId
        });

        await interaction.showModal(
            new ModalBuilder()
                .setCustomId("SET_REASON_UT9")
                .setTitle("Reason")
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
            ...(client.storage["blocked"] == null ? [] : client.storage["blocked"])
        ];

        const Channel = await User.user.createDM(true);
        Channel.send({
            content: `${Emojis.ModerationAction} You've been blocked from appealing, here's what we know:\n\n\`\`\`${Reason}\`\`\``
        });
    }
}