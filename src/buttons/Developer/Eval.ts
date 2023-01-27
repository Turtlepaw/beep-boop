import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ClientAdministrators } from "../../configuration";
import Button from "../../lib/ButtonBuilder";

export default class EvalCode extends Button {
    constructor() {
        super({
            CustomId: "EVAL_CODE",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        if (!ClientAdministrators.includes(interaction.user.id)) return;
        const Modal = new ModalBuilder()
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("code")
                            .setMaxLength(4000)
                            .setMinLength(2)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder("const client = new Client();")
                            .setLabel("Code Snippet")
                    )
            )
            .setTitle("Executing code...")
            .setCustomId("EVAL_MODAL")

        await interaction.showModal(Modal);
    }
}