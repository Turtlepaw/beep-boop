import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, AnyComponentBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, ContextMenuCommandType, EmbedBuilder, Emoji, MessageActionRowComponentBuilder, MessageComponentBuilder, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Emojis } from "../configuration";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { CreateLinkButton } from "../utils/buttons";
import { Verifiers } from "../utils/verify";
import { Filter } from "../utils/filter";
import e from "express";
import { MessageBuilderModal as CreateMessageModal } from "../utils/components";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Legacy Quick Edit",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        if (interaction.targetMessage.author.id != client.user.id) {
            return FriendlyInteractionError(interaction, "That message wasn't sent by me");
        };

        const isTicketMessage =
            interaction.targetMessage.components[0]?.components != null &&
            interaction.targetMessage.components[0].components.find(e => e.customId == "OPEN_TICKET") != null;
        const isCustomMessage =
            client.Storage.HasInArray("custom_messages", interaction.targetMessage.id);
        const isButtonMessage =
            interaction.targetMessage.components.find(e =>
                e.components.find(e => {
                    return e.customId.startsWith("button-role:")
                })
            ) != null;

        enum CustomIds {
            MoveEmbed = "MOVE_EMBED",
            EditEmbed = "EDIT_EMBED",
            RemoveButtons = "Remove_BUTTONS",
            ChannelSelect = "SELECT_CHANNEL_MENU",
            MessageBuilderModal = "MESSAGE_BUILDER_MODAL",
            TitleField = "EMBED_TITLE_FIELD",
            DescriptionField = "EMBED_DESCRIPTION_FIELD",
            ColorField = "EMBED_COLOR_FIELD",
            FooterField = "EMBED_FOOTER_FIELD",
            ContentField = "MESSAGE_CONTENT_FIELD"
        }

        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Edit Embed")
                    .setCustomId(CustomIds.EditEmbed)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(!isTicketMessage && !isCustomMessage && !isButtonMessage),
                new ButtonBuilder()
                    .setLabel("Move Embed")
                    .setCustomId(CustomIds.MoveEmbed)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(!isTicketMessage && !isCustomMessage && !isButtonMessage),
                new ButtonBuilder()
                    .setLabel("Remove Buttons")
                    .setCustomId(CustomIds.RemoveButtons)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(!isButtonMessage)
            );

        const MessageBuilderModal = CreateMessageModal(
            CustomIds.MessageBuilderModal,
            CustomIds.ContentField,
            interaction.targetMessage
        );

        const EmbedBuilderModal = new ModalBuilder()
            .setCustomId(CustomIds.MessageBuilderModal)
            .setTitle("Configuring Embed")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(CustomIds.TitleField)
                            .setLabel("Title")
                            .setMaxLength(256)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("Tickets")
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(CustomIds.DescriptionField)
                            .setLabel("Description")
                            .setMaxLength(4000)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder("Hello...")
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(CustomIds.FooterField)
                            .setLabel("Footer")
                            .setMaxLength(2048)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("Staff Team")
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(CustomIds.ColorField)
                            .setLabel("Color")
                            .setMaxLength(7)
                            .setMinLength(3)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("#5865f2")
                            .setValue("#5865f2")
                    )
            );
        const ChannelSelect = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .addOptions(
                        interaction.guild.channels.cache
                            .filter(e => e.type == ChannelType.GuildText)
                            .map(e =>
                                new SelectMenuOptionBuilder()
                                    .setEmoji(Emojis.TextChannel)
                                    .setLabel(e.name)
                                    .setValue(e.id)
                            )
                    )
                    .setCustomId(CustomIds.ChannelSelect)
                    .setPlaceholder("Select a channel")
            );

        const Message = await interaction.reply({
            content: `${Emojis.Hide} Select an option below.`,
            ephemeral: true,
            components: [ActionButtons],
            fetchReply: true
        });

        const ButtonInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0,
            filter: Filter(interaction.member, CustomIds.EditEmbed, CustomIds.MoveEmbed, CustomIds.RemoveButtons)
        });

        if (ButtonInteraction.customId == CustomIds.EditEmbed) {
            const { targetMessage } = interaction;
            const isMessage = targetMessage.content != '';
            await ButtonInteraction.showModal(
                isMessage ?
                    MessageBuilderModal :
                    EmbedBuilderModal
            );

            const ModalInteraction = await ButtonInteraction.awaitModalSubmit({
                time: 0
            });

            const targetEmbed = targetMessage.embeds[0];

            if (isMessage) {
                const Fields = {
                    MessageContent: ModalInteraction.fields.getTextInputValue(CustomIds.ContentField)
                };

                await interaction.targetMessage.edit({
                    content: Fields.MessageContent
                });
            } else {
                const Fields = {
                    Title: ModalInteraction.fields.getTextInputValue(CustomIds.TitleField),
                    Description: ModalInteraction.fields.getTextInputValue(CustomIds.DescriptionField),
                    Footer: ModalInteraction.fields.getTextInputValue(CustomIds.FooterField),
                    Color: ModalInteraction.fields.getTextInputValue(CustomIds.ColorField)
                }

                const Embed = new EmbedBuilder()
                if (Verifiers.String(Fields.Title)) Embed.setTitle(Fields.Title || targetEmbed.title)
                if (Verifiers.String(Fields.Description)) Embed.setDescription(Fields.Description || targetEmbed.description)
                if (Verifiers.String(Fields.Footer)) Embed.setFooter({
                    text: Fields.Footer || targetEmbed.footer?.text
                })
                //@ts-expect-error
                if (Verifiers.String(Fields.Color)) Embed.setColor(Fields.Color || targetEmbed.hexColor)
                await interaction.targetMessage.edit({
                    embeds: [
                        Embed
                    ]
                });
            }

            ModalInteraction.reply({
                content: `${Emojis.Success} Message successfully edited.`,
                ephemeral: true
            })
        } else if (ButtonInteraction.customId == CustomIds.MoveEmbed) {
            await ButtonInteraction.reply({
                ephemeral: true,
                content: `${Emojis.TextChannel} Select a channel below`,
                components: [ChannelSelect]
            });

            const SelectInteraction = await interaction.channel.awaitMessageComponent({
                componentType: ComponentType.SelectMenu,
                time: 0,
                filter: Filter(interaction.member, CustomIds.ChannelSelect)
            });

            const Value = SelectInteraction.values[0];
            const Channel = await interaction.guild.channels.fetch(Value);

            if (Channel == null || Channel.type != ChannelType.GuildText) {
                SendError(SelectInteraction, "INVALID_CHANNEL")
                return;
            }

            const SentMessage = await Channel.send({
                embeds: interaction.targetMessage.embeds,
                components: interaction.targetMessage.components
            });

            await SelectInteraction.reply({
                content: `${Emojis.Success} Moved embed to ${Channel}`,
                ephemeral: true,
                components: [
                    CreateLinkButton(SentMessage.url, "View Message")
                ]
            });
        } else if (ButtonInteraction.customId == CustomIds.RemoveButtons) {
            const RawButtons =
                interaction.targetMessage.components.map(e => {
                    return e.components.map(btn => {
                        if (btn.type != ComponentType.Button) return null;
                        if (btn.customId.startsWith("button-role:")) return btn;
                        else return null;
                    })
                }).filter(e => e != null)
            const Buttons =
                interaction.targetMessage.components.map(e => {
                    return new ActionRowBuilder<MessageActionRowComponentBuilder>()
                        .addComponents(
                            e.components.map(btn => {
                                if (btn.type != ComponentType.Button) return null;
                                if (btn.customId.startsWith("button-role:")) return ButtonBuilder.from(btn).setCustomId(btn.customId.replace("button-role:", "remove-btn:"));
                                else return null;
                            })
                        )
                }).filter(e => e != null);

            await ButtonInteraction.update({
                content: `${Emojis.Tag} Select a button to remove`,
                components: Buttons
            });

            const Btn = await Message.awaitMessageComponent({
                time: 0,
                componentType: ComponentType.Button
            });

            const FilteredButtons = RawButtons.map(btns => {
                return new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        btns.filter(btn => btn.customId.replace("button-role:", "remove-btn:") != Btn.customId)
                            .map(e => ButtonBuilder.from(e))
                    )
            });

            interaction.targetMessage.edit({
                components: FilteredButtons
            });

            Btn.update({
                components: [],
                content: `${Emojis.Success} Removed button successfully.`
            });
        }
    }
}