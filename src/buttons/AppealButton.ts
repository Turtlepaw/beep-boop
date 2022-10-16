import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../lib/ButtonBuilder";

export default class AddBirthday extends Button {
    constructor() {
        super({
            CustomId: "REQUEST_APPEAL",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Modal = new ModalBuilder()
            .setComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("Q1")
                            .setLabel("What did you do to get banned?")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true),
                    ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("Q2")
                        .setLabel("Why should you be unbanned?")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true),
                ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("Q3")
                            .setLabel("What's your Discord tag and Id?")
                            .setPlaceholder("DiscordUser#0000/1028790472879128676")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            )
            .setCustomId("APPEAL_MODAL")
            .setTitle("Requesting an Appeal")

        await interaction.showModal(Modal);
    }
}