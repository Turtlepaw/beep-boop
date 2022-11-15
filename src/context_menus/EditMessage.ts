import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, AnyComponentBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, ContextMenuCommandType, EmbedBuilder, Emoji, MessageActionRowComponentBuilder, MessageComponentBuilder, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputStyle, WebhookClient } from "discord.js";
import { Emojis } from "../configuration";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { CreateLinkButton } from "../utils/buttons";
import { Verifiers } from "../utils/verify";
import { Filter } from "../utils/filter";
import e from "express";
import { EmbedFrom, EmbedModal, EmbedModalFields, MessageBuilderModal as CreateMessageModal } from "../utils/components";
import { generateId } from "../utils/Id";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Quick Edit",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        const WebhookURL = client.Storage.Get(`custom_${interaction.targetMessage.id}`);
        if (WebhookURL == null) {
            return FriendlyInteractionError(interaction, "That message wasn't sent by me");
        };
        const Webhook = new WebhookClient({ url: WebhookURL });

        const isTicketMessage =
            interaction.targetMessage.components[0]?.components != null &&
            interaction.targetMessage.components[0].components.find(e => e.customId == "OPEN_TICKET") != null;
        const isCustomMessage =
            client.Storage.HasInArray("custom_messages", interaction.targetMessage.id);
        const isButtonMessage =
            interaction.targetMessage.components.find(e =>
                e.components.find(e => {
                    if (e?.customId == null) return;
                    return e.customId.startsWith("button-role:")
                })
            ) != null;

        enum CustomIds {
            MoveEmbed = "MOVE_EMBED",
            EditEmbed = "EDIT_EMBED",
            RemoveButtons = "Remove_BUTTONS",
            ChannelSelect = "SELECT_CHANNEL_MENU",
            MessageBuilderModal = "MESSAGE_BUILDER_MODAL",
            ContentField = "MESSAGE_CONTENT_FIELD"
        }

        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Edit Message")
                    .setCustomId(CustomIds.EditEmbed)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(!isTicketMessage && !isCustomMessage && !isButtonMessage),
                new ButtonBuilder()
                    .setLabel("Move Message")
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

        const EmbedBuilderModal = EmbedModal(CustomIds.MessageBuilderModal, interaction.targetMessage);
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

                await Webhook.editMessage(interaction.targetMessage.id, {
                    content: Fields.MessageContent
                });
            } else {
                const Embed = EmbedFrom(ModalInteraction)
                await Webhook.editMessage(interaction.targetMessage.id, {
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
            await ButtonInteraction.update({
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

            const CreatedWebhook = await Channel.createWebhook({
                name: interaction.targetMessage.author.username,
                avatar: interaction.targetMessage.author.avatarURL()
            });

            const SentMessage = await CreatedWebhook.send({
                embeds: interaction.targetMessage.embeds,
                components: interaction.targetMessage.components
            });

            if (interaction.targetMessage.deletable) interaction.targetMessage.delete();

            client.Storage.Create(`custom_${SentMessage.id}`, CreatedWebhook.url);
            client.Storage.Delete(`custom_${interaction.targetMessage.id}`)

            await SelectInteraction.update({
                content: `${Emojis.Success} Moved message to ${Channel}`,
                components: [
                    CreateLinkButton(SentMessage.url, "View Message")
                ]
            });
        } else if (ButtonInteraction.customId == CustomIds.RemoveButtons) {
            const RawButtons =
                interaction.targetMessage.components.map(e => {
                    return e.components.map(btn => {
                        if (btn.type != ComponentType.Button) return null;
                        if (btn?.customId == null && btn.style == ButtonStyle.Link) return btn;
                        if (btn.customId.startsWith("button-role:") || btn.customId == "OPEN_TICKET") return btn;
                        else return null;
                    })
                }).filter(e => e != null)
            const Buttons =
                interaction.targetMessage.components.map(e => {
                    return new ActionRowBuilder<MessageActionRowComponentBuilder>()
                        .addComponents(
                            e.components.map(btn => {
                                if (btn.type != ComponentType.Button) return null;
                                if (btn?.customId == null && btn.style == ButtonStyle.Link) return new ButtonBuilder()
                                    .setCustomId(`link:${btn.url}`)
                                    .setLabel(btn.label)
                                    .setStyle(ButtonStyle.Secondary);
                                if (btn.customId.startsWith("button-role:") || btn.customId == "OPEN_TICKET") return ButtonBuilder.from(btn)
                                    .setCustomId(btn.customId == "OPEN_TICKET" ? `remove-role:OPEN_TICKET` : btn.customId.replace("button-role:", "remove-btn:"));
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
                        btns.filter(bt => {
                            if (bt.style == ButtonStyle.Link) {
                                return bt.url != Btn.customId.replace("link:", "");
                            } else if (bt.customId.includes("OPEN_TICKET")) {
                                return bt.customId != Btn.customId.replace("remove-role:", "")
                            } else return bt.customId.replace("button-role:", "remove-btn:") != Btn.customId;
                        })
                            .map(e => ButtonBuilder.from(e))
                    )
            });

            Webhook.editMessage(interaction.targetMessage.id, {
                components: FilteredButtons[0].components.length == 0 ? [] : FilteredButtons
            });

            Btn.update({
                components: [],
                content: `${Emojis.Success} Removed button successfully.`
            });
        }
    }
}