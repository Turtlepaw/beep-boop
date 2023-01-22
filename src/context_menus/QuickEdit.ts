import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, APIButtonComponentWithCustomId, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, MessageActionRowComponentBuilder, MessageContextMenuCommandInteraction, time, TimestampStyles } from "discord.js";
import { Embed, Icons } from "../configuration";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { Filter } from "../utils/filter";
import { ButtonBuilderModal, ChannelSelector } from "../utils/components";
import { FindWebhook } from "../utils/Webhook";
import { ShortenURL } from "../utils/Discohook";
import { GetTextInput } from "../utils/components";

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
        //const WebhookURL = client.Storage.Get(`custom_${interaction.targetMessage.id}`);
        const Webhook = await FindWebhook(interaction.targetId, interaction.channelId, client);
        if (Webhook == null) {
            return FriendlyInteractionError(interaction, "That message wasn't sent by me");
        }

        const isTicketMessage =
            interaction.targetMessage.components[0]?.components != null &&
            interaction.targetMessage.components[0].components.find(e => e.customId == "OPEN_TICKET") != null;
        const isCustomMessage = true;
        //client.Storage.HasInArray("custom_messages", interaction.targetMessage.id);
        const isButtonMessage =
            interaction.targetMessage.components.find(e =>
                e.components.find(e => {
                    if (e?.customId == null) return;
                    return e.customId.startsWith("button-role:") ||
                        e.customId == "VERIFY_USER" ||
                        e.customId == "OPEN_TICKET";
                })
            ) != null;

        enum CustomIds {
            MoveEmbed = "MOVE_EMBED",
            EditEmbed = "EDIT_EMBED",
            RemoveButtons = "Remove_BUTTONS",
            ChannelSelect = "SELECT_CHANNEL_MENU",
            MessageBuilderModal = "MESSAGE_BUILDER_MODAL",
            ContentField = "MESSAGE_CONTENT_FIELD",
            EditButtons = "EDIT_BUTTONS",
            EditButtonModal = "EDIT_BUTTON_MODAL"
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
                    .setLabel("Edit Buttons")
                    .setCustomId(CustomIds.EditButtons)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(!isButtonMessage),
                new ButtonBuilder()
                    .setLabel("Remove Buttons")
                    .setCustomId(CustomIds.RemoveButtons)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(!isButtonMessage)
            );

        const ChannelSelect = new ChannelSelector()
            .SetChannelTypes(ChannelType.GuildText)
            .SetCustomId(CustomIds.ChannelSelect);

        const Message = await interaction.reply({
            content: `${Icons.Flag} Select an option below.`,
            ephemeral: true,
            components: [ActionButtons],
            fetchReply: true
        });

        const ButtonInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: CustomIds
            })
        });

        if (ButtonInteraction.customId == CustomIds.EditEmbed) {
            await ButtonInteraction.deferUpdate();

            const URL = await ShortenURL(interaction.targetMessage, Webhook)
            const date = new Date(URL.expires);
            await ButtonInteraction.editReply({
                embeds: [
                    new Embed(interaction.guild)
                        .setDescription(`${URL.url}`)
                        .setTitle(`${Icons.Configure} Generated URL`)
                        .addFields([{
                            name: `${Icons.Clock} Expires`,
                            value: `${time(date, TimestampStyles.RelativeTime)} or ${time(date, TimestampStyles.LongDate)}`
                        }])
                ],
                content: null,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Open in Discohook")
                                .setStyle(ButtonStyle.Link)
                                .setURL(
                                    URL.url //GenerateURL({ Webhook })
                                )
                        )
                ],
                //ephemeral: true
            });
        } else if (ButtonInteraction.customId == CustomIds.MoveEmbed) {
            await ButtonInteraction.update({
                content: `${Icons.Channel} Select a channel below`,
                components: ChannelSelect.toComponents()
            });

            const SelectInteraction = await Message.awaitMessageComponent({
                componentType: ComponentType.StringSelect,
                time: 0,
                filter: Filter({
                    member: interaction.member,
                    customIds: [CustomIds.ChannelSelect]
                })
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
                components: interaction.targetMessage.components,
                files: Array.from(interaction.targetMessage.attachments.values()),
                content: interaction.targetMessage.content
            });

            if (interaction.targetMessage.deletable) interaction.targetMessage.delete();

            // client.Storage.Create(`custom_${SentMessage.id}`, CreatedWebhook.url);
            // client.Storage.Delete(`custom_${interaction.targetMessage.id}`)
            client.Storage.CustomWebhooks.Delete({
                url: Webhook.url
            });

            client.Storage.CustomWebhooks.Create({
                channelId: Channel.id,
                url: CreatedWebhook.url
            });

            const url = await ShortenURL(SentMessage, Webhook);
            await SelectInteraction.update({
                content: `${Icons.Success} Moved message to ${Channel}`,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setURL(SentMessage.url)
                                .setLabel("View Message")
                                .setStyle(ButtonStyle.Link),
                            new ButtonBuilder()
                                .setURL(
                                    url.url//GenerateURL({ Webhook })
                                )
                                .setStyle(ButtonStyle.Link)
                                .setLabel("Edit in Discohook")
                        )
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
                content: `${Icons.Tag} Select a button to remove`,
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
                content: `${Icons.Success} Removed button successfully.`
            });
        } else if (ButtonInteraction.customId == CustomIds.EditButtons) {
            const RawButtons =
                interaction.targetMessage.components.map(e => {
                    return e.components.map(btn => {
                        if (btn.type != ComponentType.Button) return null;
                        if (btn?.customId == null && btn.style == ButtonStyle.Link) return btn;
                        if (btn.customId.startsWith("button-role:") || btn.customId == "OPEN_TICKET" || btn.customId == "VERIFY_USER") return btn;
                        else return null;
                    })
                }).filter(e => e != null)
            const Buttons =
                interaction.targetMessage.components.map(e => {
                    return new ActionRowBuilder<MessageActionRowComponentBuilder>()
                        .addComponents(
                            e.components.map(btn => {
                                if (btn.type != ComponentType.Button) return null;
                                else if (btn?.customId == null && btn.style == ButtonStyle.Link) return new ButtonBuilder()
                                    .setCustomId(`link:${btn.url}`)
                                    .setLabel(btn.label)
                                    .setStyle(ButtonStyle.Secondary);
                                else if (btn.customId.startsWith("button-role:") || btn.customId == "OPEN_TICKET" || btn.customId == "VERIFY_USER") return ButtonBuilder.from(btn)
                                    .setCustomId(btn.customId == "OPEN_TICKET" ? `edit-role:OPEN_TICKET` : (
                                        btn.customId == "VERIFY_USER" ? "edit-role:VERIFY_USER" :
                                            btn.customId.replace("button-role:", "edit-btn:"))
                                    )
                                else return null;
                            })
                        )
                }).filter(e => e != null);

            await ButtonInteraction.update({
                content: `${Icons.Tag} Select a button to edit`,
                components: Buttons
            });

            const Btn = await Message.awaitMessageComponent({
                time: 0,
                componentType: ComponentType.Button
            });

            const AllButtons: ButtonBuilder[] = [];
            for (const ButtonRow of Buttons.map(e => e.components)) {
                for (const btn of ButtonRow) AllButtons.push(btn as ButtonBuilder);
            }

            const Selected = AllButtons.find(e => {
                if (e.data.style == ButtonStyle.Link) return false;
                else return e.data.custom_id == Btn.customId;
            });

            Buttons.find(e => {
                return e.components.find((e) => {
                    const Component = e.toJSON() as APIButtonComponentWithCustomId;
                    return Component.custom_id == Btn.customId;
                })
            });

            const FilteredButtons = RawButtons.map(btns => {
                return new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        btns
                            .map(e => ButtonBuilder.from(e))
                    )
            });

            enum Fields {
                Emoji = "BUTTON_EMOJI",
                Label = "BUTTON_LABEL",
                Link = "BUTTON_URL"
            }

            const ModalFields = {
                Emoji: Fields.Emoji,
                Label: Fields.Label,
                Link: Fields.Link
            }

            await Btn.showModal(
                ButtonBuilderModal(CustomIds.EditButtonModal, ModalFields, Selected.data.style == ButtonStyle.Link ? ButtonStyle.Link : null)
            );

            const ModalSubmit = await Btn.awaitModalSubmit({
                time: 0
            });

            const ResolvedFields = {
                Link: GetTextInput(Fields.Link, ModalSubmit),
                Label: GetTextInput(Fields.Label, ModalSubmit),
                Emoji: GetTextInput(Fields.Emoji, ModalSubmit)
            };

            await (async () => {
                FilteredButtons[0].components.forEach(component => {
                    if (component.data.style == ButtonStyle.Link) return;
                    if (component.data.custom_id == Btn.customId.replace("edit-role:", "")) {
                        if (Verifiers.String(ResolvedFields.Emoji)) component.setEmoji(ResolvedFields.Emoji);
                        if (Verifiers.String(ResolvedFields.Label)) component.setLabel(ResolvedFields.Label);
                        if (Verifiers.String(ResolvedFields.Link)) component.setEmoji(ResolvedFields.Link);
                    }
                });
            })();

            Webhook.editMessage(interaction.targetMessage.id, {
                components: FilteredButtons
            });

            ModalSubmit.reply({
                ephemeral: true,
                components: [],
                content: `${Icons.Success} Edited button successfully.`
            });
        }
    }
}