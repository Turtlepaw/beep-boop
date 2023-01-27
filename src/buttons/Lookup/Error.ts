import { ActionRowBuilder, ButtonInteraction, Client, codeBlock, inlineCode, ModalBuilder, quote, TextInputBuilder, TextInputStyle, time, TimestampStyles, userMention } from "discord.js";
import { ClientAdministrators, Embed, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";

export default class ErrorLookup extends Button {
    constructor() {
        super({
            CustomId: "ERROR_LOOKUP",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        if (!ClientAdministrators.includes(interaction.user.id)) return;

        enum Fields {
            ErrorId = "ERROR_ID"
        }

        const Modal = new ModalBuilder()
            .setCustomId("ERROR_LOOKUP_MODAL")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(Fields.ErrorId)
                            .setLabel("Error Id")
                            .setPlaceholder("2")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    )
            )
            .setTitle("Error Lookup");

        await interaction.showModal(Modal);
        const modal = await interaction.awaitModalSubmit({
            time: 0
        });

        const error = await client.Storage.Errors.Get({
            Error: modal.fields.getTextInputValue(Fields.ErrorId)
        });

        if (error == null) return await modal.reply({
            ephemeral: true,
            content: `${Icons.Search} That error doesn't seem to exist`
        });

        await modal.reply({
            content: `${Icons.Search} Created ${time(error.CreatedAt, TimestampStyles.RelativeTime)} by ${userMention(error.CreatedBy)}`,
            embeds: [
                await new Embed(interaction.guild)
                    .setDescription(`${quote(codeBlock(error.Title))}`)
                    .addFields([{
                        name: "\u200b",
                        value: inlineCode(error.Stack)
                    }])
                    .Resolve()
            ]
        });
    }
}