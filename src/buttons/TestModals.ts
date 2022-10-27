import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, InteractionResponse, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../lib/ButtonBuilder";

export default class TestThreads extends Button {
    constructor() {
        super({
            CustomId: "test_modals",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await interaction.showModal(
            new ModalBuilder()
                .setTitle("Modals")
                .setCustomId("TEST_MODAL")
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("What's your favorite emoji?")
                                .setCustomId("EMOJI")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                        )
                )
        );

        const ModalInteraction = await interaction.awaitModalSubmit({
            time: 0
        });

        const Emoji = ModalInteraction.fields.getTextInputValue("EMOJI");

        ModalInteraction.reply({
            ephemeral: true,
            content: "Your favorite emoji is: " + Emoji
        });
    }
}