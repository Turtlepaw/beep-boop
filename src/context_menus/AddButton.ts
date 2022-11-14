import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, Client, ComponentType, ContextMenuCommandType, InteractionType, MessageActionRowComponent, MessageActionRowComponentBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits, RepliableInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, WebhookClient } from "discord.js";
import { Filter } from "../utils/filter";
import { Emojis } from "../configuration";
import { ButtonBuilderModal, GetTextInput } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Add Button",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["ManageRoles", "ManageGuild"],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        enum ModalId {
            Modal = "BUTTON_BUILDER_MODAL",
            LabelField = "BUTTON_LABEL_FIELD",
            EmojiField = "BUTTON_EMOJI_FIELD",
            LinkField = "BUTTON_LINK_FIELD"
        }
        const Target = interaction.targetMessage;
        const Ids = {
            Emoji: ModalId.EmojiField,
            Label: ModalId.LabelField,
            Link: ModalId.LinkField
        };
        const WebhookURL = client.Storage.Get(`custom_${Target.id}`);

        if (WebhookURL == null)
            return FriendlyInteractionError(interaction, "That message wasn't sent by me")

        const Webhook = new WebhookClient({ url: WebhookURL });
        const ButtonModal = ButtonBuilderModal(ModalId.Modal, Ids);
        const LinkButtonModal = ButtonBuilderModal(ModalId.Modal, Ids, ButtonStyle.Link);
        let Button: ButtonBuilder = new ButtonBuilder();
        let ReplyMessage: ButtonInteraction;
        const ButtonTypeSelector = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("BUTTON_TYPE_SELECTOR")
                    .addOptions(
                        new SelectMenuOptionBuilder()
                            .setLabel("Role Button")
                            .setEmoji(Emojis.Role)
                            .setDescription("Creates a button to give or remove a role.")
                            .setValue("ROLE_BUTTON"),
                        new SelectMenuOptionBuilder()
                            .setLabel("Link Button")
                            .setEmoji(Emojis.Link)
                            .setDescription("Creates a button to link to another website.")
                            .setValue("LINK_BUTTON")
                    )
            );
        const RoleSelector = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("ROLE_SELECT")
                    .addOptions(
                        interaction.guild.roles.cache.filter(e => e.position).map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.Role)
                        )
                    )
            );

        const Message = await interaction.reply({
            content: `${Emojis.Search} Select a button type below`,
            components: [
                ButtonTypeSelector
            ],
            ephemeral: true,
            fetchReply: true
        });

        const ButtonType = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            filter: Filter(interaction.member, "BUTTON_TYPE_SELECTOR"),
            time: 0
        });

        const isRoleButton = ButtonType.values[0] == "ROLE_BUTTON";
        const isLinkButton = !isRoleButton;

        if (isRoleButton) {
            await ButtonType.update({
                content: `${Emojis.Role} Select a role below`,
                components: [
                    RoleSelector
                ],
                fetchReply: true
            });

            const Select = await Message.awaitMessageComponent({
                componentType: ComponentType.StringSelect,
                filter: Filter(interaction.member, "ROLE_SELECT"),
                time: 0
            });

            const Role = await interaction.guild.roles.fetch(Select.values[0]);
            Button = new ButtonBuilder()
                .setCustomId(`button-role:${Role.id}`)
                .setLabel(Role.name);
            const ButtonStyles = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    ButtonBuilder.from(Button)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(ButtonStyle[ButtonStyle.Primary]),
                    ButtonBuilder.from(Button)
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(ButtonStyle[ButtonStyle.Secondary]),
                    ButtonBuilder.from(Button)
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId(ButtonStyle[ButtonStyle.Danger]),
                    ButtonBuilder.from(Button)
                        .setStyle(ButtonStyle.Success)
                        .setCustomId(ButtonStyle[ButtonStyle.Success])
                );

            const StyleMessage = await Select.update({
                content: `${Emojis.Tag} Select a button style`,
                components: [ButtonStyles]
            });

            ReplyMessage = await Message.awaitMessageComponent({
                componentType: ComponentType.Button,
                filter: Filter(interaction.member,
                    ButtonStyle[ButtonStyle.Success],
                    ButtonStyle[ButtonStyle.Danger],
                    ButtonStyle[ButtonStyle.Primary],
                    ButtonStyle[ButtonStyle.Secondary]
                ),
                time: 0
            });

            Button.setStyle(ButtonStyle[ReplyMessage.customId as string]);
        } else {
            Button.setStyle(ButtonStyle.Link);
        }

        const ButtonReply = ReplyMessage != null ? ReplyMessage : ButtonType;
        await ButtonReply.update({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        ...(isRoleButton ? [
                            new ButtonBuilder()
                                .setCustomId("DEFAULT_VALUES")
                                .setLabel("Default Values")
                                .setStyle(ButtonStyle.Primary)
                        ] : []),
                        new ButtonBuilder()
                            .setCustomId("VALUE_SELECT")
                            .setLabel("Select Values")
                            .setStyle(ButtonStyle.Secondary)
                    )
            ],
            content: `${Emojis.MessagePin} Select button values`
        });

        const Value = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: Filter(interaction.member, "VALUE_SELECT", "DEFAULT_VALUES"),
            time: 0
        });

        let ReplyTo: any;
        if (Value.customId == "VALUE_SELECT") {
            Value.showModal(
                isLinkButton ? LinkButtonModal : ButtonModal
            );

            const Modal = await Value.awaitModalSubmit({
                time: 0
            });

            const Fields = {
                Label: GetTextInput(ModalId.LabelField, Modal),
                Emoji: GetTextInput(ModalId.EmojiField, Modal),
                Link: GetTextInput(ModalId.LinkField, Modal)
            }

            Button.setLabel(Fields.Label)
            if (Fields.Emoji != '') Button.setEmoji(Fields.Emoji);
            if (Fields.Link != null) Button.setURL(Fields.Link);

            ReplyTo = Modal;
        } else {
            ReplyTo = Value;
        }

        await Webhook.editMessage(Target.id, {
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        ...(Target.components[0]?.components != null ? Target.components[0].components.map(e => {
                            if (e.type == ComponentType.SelectMenu) {
                                return SelectMenuBuilder.from(e);
                            } else if (e.type == ComponentType.Button) {
                                return ButtonBuilder.from(e);
                            }
                        }) : []),
                        Button
                    )
            ]
        });

        const Options = {
            content: `${Emojis.Success} Successfully created button role.`,
            components: []
        };

        if (ReplyTo?.update != null) {
            await ReplyTo.update(Options);
        } else {
            await ReplyTo.editReply({
                components: [],
                content: "\u200B"
            });

            await ReplyTo.reply(Options);
        }
    }
}