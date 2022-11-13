import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "@discordjs/builders"
import { Channel, ChannelType, Collection, SelectMenuOptionBuilder, DataManager, GuildBasedChannel, GuildChannelResolvable, SelectMenuBuilder, TextInputStyle, ModalSubmitInteraction, EmbedBuilder, ButtonStyle } from "discord.js"
import { Emojis } from "../configuration"

export function EmbedModal(CustomId: string = "CONFIGURE_EMBED") {
    return new ModalBuilder()
        .setCustomId(CustomId)
        .setTitle("Configuring Embed")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("EMBED_TITLE")
                        .setLabel("Title")
                        .setMaxLength(256)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Some great title!")
                ),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("EMBED_DESCRIPTION")
                        .setLabel("Description")
                        .setMaxLength(4000)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder("Here's the embed's description, you can write up to 4000 characters")
                ),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("EMBED_FOOTER")
                        .setLabel("Footer")
                        .setMaxLength(2048)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Great Embed")
                ),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("EMBED_COLOR")
                        .setLabel("Color")
                        .setMaxLength(7)
                        .setMinLength(3)
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("#5865f2")
                        .setValue("#5865f2")
                )
        )
}

export function EmbedFrom(Modal: ModalSubmitInteraction) {
    const Fields = {
        Title: Modal.fields.getTextInputValue("EMBED_TITLE"),
        Description: Modal.fields.getTextInputValue("EMBED_DESCRIPTION"),
        Footer: Modal.fields.getTextInputValue("EMBED_FOOTER"),
        Color: Modal.fields.getTextInputValue("EMBED_COLOR")
    }

    const Embed = new EmbedBuilder();

    //@ts-expect-error
    if (Fields.Color != '') Embed.setColor(Fields.Color);
    if (Fields.Description != '') Embed.setDescription(Fields.Description);
    if (Fields.Title != '') Embed.setTitle(Fields.Title);
    if (Fields.Footer != '') Embed.setFooter({ text: Fields.Footer });

    return Embed;
}

export function ChannelSelectMenu(CustomId: string = "CHANNEL_SELECT", Channels: Collection<string, GuildBasedChannel>) {
    return new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId("CHANNEL_SELECT")
                .addOptions(
                    Channels.filter(e => e.type == ChannelType.GuildText).map(e =>
                        new SelectMenuOptionBuilder()
                            .setLabel(e.name)
                            .setValue(e.id)
                            .setEmoji(Emojis.TextChannel)
                    )
                )
        )
}

export function MessageBuilderModal(CustomId: string = "MESSAGE_BUILDER_MODAL", FieldId: string = "MESSAGE_CONTENT_FIELD") {
    return new ModalBuilder()
        .setCustomId(CustomId)
        .setTitle("Configuring Message")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(FieldId)
                        .setLabel("Message Content")
                        .setMaxLength(2000)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder("Some great message!")
                )
        );
}

export interface ButtonFields {
    Label: string;
    Emoji: string;
    Link?: string;
}

export function ButtonBuilderModal(CustomId: string = "BUTTON_BUILDER_MODAL", Fields: ButtonFields, ButtonType: ButtonStyle = ButtonStyle.Primary) {
    const Components = [
        new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId(Fields.Label)
                    .setLabel("Button Label")
                    .setMaxLength(80)
                    .setRequired(true)
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Button")
            ),
        new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId(Fields.Link)
                    .setLabel("Button Link")
                    .setMaxLength(80)
                    .setRequired(true)
                    .setMinLength(12)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("https://discord.com/")
            )
    ];

    return new ModalBuilder()
        .setCustomId(CustomId)
        .setTitle("Configuring Button")
        .addComponents(
            ...Components,
            ...(ButtonType == ButtonStyle.Link ? [
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(Fields.Emoji)
                            .setLabel("Button Link")
                            .setMaxLength(10)
                            .setRequired(false)
                            .setMinLength(1)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("✨")
                    )
            ] : [])
        );
}
