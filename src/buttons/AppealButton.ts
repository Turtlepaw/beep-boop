import { ActionRowBuilder, ButtonInteraction, Client, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../lib/ButtonBuilder";
import { Icons } from "../configuration";

export enum ModalQuestions {
    BanReason = "question_1",
    UnbanReason = "question_2",
}

export const ModalId = "APPEAL_MODAL";

export default class AppealButton extends Button {
    constructor() {
        super({
            CustomId: "REQUEST_APPEAL",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Info = client.QuickStorage[`appealmsg_${interaction.message.id}`];
        const config = await client.Storage.Configuration.forGuild({ id: Info.guild, name: "Unknown" });
        if (config.isUserAppealBlocked(interaction.user.id)) {
            await interaction.reply({
                content: `${Icons.Date} You're blocked from appealing, we already sent you a message about why you were blocked.`,
                ephemeral: true
            })
            return;
        }

        const Modal = new ModalBuilder()
            .setComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(ModalQuestions.BanReason)
                            .setLabel("What did you do to get banned?")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true),
                    ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId(ModalQuestions.UnbanReason)
                        .setLabel("Why should you be unbanned?")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true),
                )
            )
            .setCustomId(ModalId)
            .setTitle("Requesting an Appeal");

        await interaction.showModal(Modal);
    }
}