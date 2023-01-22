import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../lib/ButtonBuilder";

export const RedeemCodeModal = "REDEEM_CODE_MODAL";
export default class RedeemCode extends Button {
    constructor() {
        super({
            CustomId: "REDEEM_CODE",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        await interaction.showModal(
            new ModalBuilder()
                .setTitle("Redeem Code")
                .setCustomId(RedeemCodeModal)
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId("CODE")
                                .setLabel("Code")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder("WUMP-CODE-HERE")
                                .setMinLength(14)
                                .setMaxLength(14)
                        )
                )
        );
    }
}