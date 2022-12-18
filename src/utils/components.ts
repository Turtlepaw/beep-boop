import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "@discordjs/builders"
import { Channel, ChannelType, Collection, SelectMenuOptionBuilder, DataManager, GuildBasedChannel, GuildChannelResolvable, SelectMenuBuilder, TextInputStyle, ModalSubmitInteraction, EmbedBuilder, ButtonStyle, Message as GuildMessage, TextBasedChannel, TextChannel, ChannelSelectMenuBuilder, AnySelectMenuInteraction, MentionableSelectMenuBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder } from "discord.js"
import { Emojis } from "../configuration";
import { Verifiers } from "./verify";

export enum EmbedModalFields {
    Title = "BUILDER_TITLE_FIELD",
    Description = "BUILDER_DESCRIPTION_FIELD",
    FooterText = "BUILDER_FOOTER_TEXT_FIELD",
    Color = "BUILDER_COLOR_FIELD"
}
export function EmbedModal(CustomId: string = "CONFIGURE_EMBED", Message: GuildMessage) {
    const Fields = {
        Title: new TextInputBuilder()
            .setCustomId(EmbedModalFields.Title)
            .setLabel("Title")
            .setMaxLength(256)
            .setRequired(false)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Some great title!"),
        Description: new TextInputBuilder()
            .setCustomId(EmbedModalFields.Description)
            .setLabel("Description")
            .setMaxLength(4000)
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Here's the embed's description, you can write up to 4000 characters"),
        FooterText: new TextInputBuilder()
            .setCustomId(EmbedModalFields.FooterText)
            .setLabel("Footer")
            .setMaxLength(2048)
            .setRequired(false)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Great Embed"),
        Color: new TextInputBuilder()
            .setCustomId(EmbedModalFields.Color)
            .setLabel("Color")
            .setMaxLength(7)
            .setMinLength(3)
            .setRequired(false)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("#5865f2")
    }

    const Embed = Message.embeds[0];

    if (Verifiers.String(Embed?.title)) Fields.Title.setValue(Embed?.title);
    if (Verifiers.String(Embed?.description)) Fields.Description.setValue(Embed?.description)
    if (Verifiers.String(Embed?.footer?.text)) Fields.FooterText.setValue(Embed?.footer?.text)
    if (Verifiers.String(Embed?.hexColor)) Fields.Color.setValue(Embed?.hexColor || "#5865f2")

    return new ModalBuilder()
        .setCustomId(CustomId)
        .setTitle("Configuring Embed")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    Fields.Title
                ),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    Fields.Description
                ),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    Fields.FooterText
                ),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    Fields.Color
                )
        )
}

export function EmbedFrom(Modal: ModalSubmitInteraction) {
    const Fields = {
        Title: GetTextInput(EmbedModalFields.Title, Modal),
        Description: GetTextInput(EmbedModalFields.Description, Modal),
        Footer: GetTextInput(EmbedModalFields.FooterText, Modal),
        Color: GetTextInput(EmbedModalFields.Color, Modal)
    }

    const Embed = new EmbedBuilder();

    if (Verifiers.String(Fields.Description)) Embed.setDescription(Fields.Description);
    if (Verifiers.String(Fields.Title)) Embed.setTitle(Fields.Title);
    if (Verifiers.String(Fields.Footer)) Embed.setFooter({ text: Fields.Footer });
    //@ts-expect-error
    if (Verifiers.String(Fields.Color)) Embed.setColor(Fields.Color);

    return Embed;
}

export function GetTextInput(Id: string, interaction: ModalSubmitInteraction) {
    return interaction.fields.fields.get(Id)?.value;
}

export type Channels = Collection<string, GuildBasedChannel>;

export type AnySelectMenuBuilder = StringSelectMenuBuilder |
    RoleSelectMenuBuilder |
    ChannelSelectMenuBuilder |
    UserSelectMenuBuilder |
    MentionableSelectMenuBuilder;

export type SelectorConfiguration<T extends AnySelectMenuBuilder> = (SelectMenu: T) => AnySelectMenuBuilder;
export class Selector<T extends AnySelectMenuBuilder> {
    public Configuration: SelectorConfiguration<T>;
    public CustomId: string;

    public SetCustomId(customId: string) {
        this.CustomId = customId;
        return this;
    }

    public Configure(Configuration: SelectorConfiguration<T>) {
        this.Configuration = Configuration;
        return this;
    }

    //@ts-expect-error
    public toBuilder(): T { };

    public toActionRow(): ActionRowBuilder<T> {
        return new ActionRowBuilder<T>()
            .addComponents(
                this.toBuilder()
            );
    }
}

export class ChannelSelector extends Selector<ChannelSelectMenuBuilder> {
    public ChannelTypes: ChannelType[] = [ChannelType.GuildText];

    public SetChannelTypes(...Types: ChannelType[]) {
        this.ChannelTypes = Types;
        return this;
    }

    public toBuilder(): ChannelSelectMenuBuilder {
        if (this?.CustomId == null || typeof this.CustomId != "string") throw new Error("CustomId must be a string and cannot be left null");
        const Builder = new ChannelSelectMenuBuilder()
            .setCustomId(this.CustomId)
            .setChannelTypes(this.ChannelTypes);
        if (this?.Configuration != null) this.Configuration(Builder);
        return Builder;
    }
}

export class RoleSelector extends Selector<RoleSelectMenuBuilder> {
    public toBuilder(): RoleSelectMenuBuilder {
        if (this?.CustomId == null || typeof this.CustomId != "string") throw new Error("CustomId must be a string and cannot be left null");
        const Builder = new RoleSelectMenuBuilder()
            .setCustomId(this.CustomId);
        if (this?.Configuration != null) this.Configuration(Builder);
        return Builder;
    }
}

/**
 * @deprecated use ChannelSelector class instead
 */
export function ChannelSelectMenu(CustomId: string = "CHANNEL_SELECT", Type?: Channels | ChannelType, Configuration?: (selectMenu: ChannelSelectMenuBuilder) => any) {
    if (typeof Type != "number") Type = ChannelType.GuildText
    const Component = new ChannelSelectMenuBuilder()
        .setCustomId(CustomId)
        /*.addOptions(
            channels.map(e =>
                new SelectMenuOptionBuilder()
                    .setLabel(e.name)
                    .setValue(e.id)
                    .setEmoji(Emojis.TextChannel)
            )
        )*/
        .setChannelTypes(
            Type
        )

    if (Configuration != null) Configuration(Component);
    return new ActionRowBuilder<ChannelSelectMenuBuilder>()
        .addComponents(
            Component
        )
}

export function MessageBuilderModal(CustomId: string = "MESSAGE_BUILDER_MODAL", FieldId: string = "MESSAGE_CONTENT_FIELD", Message: GuildMessage) {
    const ContentField = new TextInputBuilder()
        .setCustomId(FieldId)
        .setLabel("Message Content")
        .setMaxLength(2000)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Some great message!");

    if (Verifiers.String(Message?.content)) ContentField.setValue(Message.content);
    return new ModalBuilder()
        .setCustomId(CustomId)
        .setTitle("Configuring Message")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    ContentField
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
                    .setCustomId(Fields.Emoji)
                    .setLabel("Button Emoji")
                    .setMaxLength(10)
                    .setRequired(false)
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("✨")
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
                            .setCustomId(Fields.Link)
                            .setLabel("Button Link")
                            .setMaxLength(80)
                            .setRequired(true)
                            .setMinLength(12)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("https://discord.com/")
                    )
            ] : [])
        );
}
