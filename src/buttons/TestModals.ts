import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../lib/ButtonBuilder";

export default class TestModals extends Button {
    constructor() {
        super({
            CustomId: "test_modals",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
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