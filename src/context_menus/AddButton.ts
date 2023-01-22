import ContextMenu from "../lib/ContextMenuBuilder";
import { APIButtonComponent, APIButtonComponentWithURL, APIRole, ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, ComponentType, MessageActionRowComponentBuilder, MessageComponentInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, Role, RoleSelectMenuInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js";
import { Filter } from "../utils/filter";
import { Icons, Permissions } from "../configuration";
import { ButtonBuilderModal, GetTextInput, RoleSelector } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { FindWebhook } from "../utils/Webhook";
import { ArrayUtils } from "../utils/classes";

function isApiLinkButton(component: APIButtonComponent): component is APIButtonComponentWithURL {
    //@ts-expect-error were checking if thats not null
    return component?.url != null;
}

enum ButtonTypes {
    RoleButton = "ROLE_BUTTON",
    LinkButton = "LINK_BUTTON",
    TicketButton = "TICKET_BUTTON",
    VerificationButton = "VERIFY_BUTTON"
}

export {
    ButtonTypes as CustomButtonType
}

export default class AddButton extends ContextMenu {
    constructor() {
        super({
            Name: "Add Button",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
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
        enum Id {
            ButtonTypeSelector = "SELECT_BUTTON_TYPE",
            RoleSelector = "SELECT_BUTTON_ROLE",
            DefaultValues = "DEFAULT_BUTTON_VALUES",
            CustomValues = "CUSTOM_BUTTON_VALUES"
        }

        const Target = interaction.targetMessage;
        const Ids = {
            Emoji: ModalId.EmojiField,
            Label: ModalId.LabelField,
            Link: ModalId.LinkField
        };
        const Webhook = await FindWebhook(interaction.targetMessage.id, interaction.channel.id, client); //client.Storage.Get(`custom_${Target.id}`);

        if (Webhook == null)
            return FriendlyInteractionError(interaction, "That message wasn't sent by me")

        //const Webhook = new WebhookClient({ url: WebhookURL });
        const ButtonModal = ButtonBuilderModal(ModalId.Modal, Ids);
        const LinkButtonModal = ButtonBuilderModal(ModalId.Modal, Ids, ButtonStyle.Link);
        const Button: ButtonBuilder = new ButtonBuilder();
        let ReplyMessage: ButtonInteraction | ModalSubmitInteraction;
        const ButtonTypeSelector = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(Id.ButtonTypeSelector)
                    .addOptions(
                        new SelectMenuOptionBuilder()
                            .setLabel("Role Button")
                            .setEmoji(Icons.Flag)
                            .setDescription("Create a button to dynamically give or remove a role.")
                            .setValue(ButtonTypes.RoleButton),
                        new SelectMenuOptionBuilder()
                            .setLabel("Link Button")
                            .setEmoji(Icons.Link)
                            .setDescription("Creates a button to link to an external website.")
                            .setValue(ButtonTypes.LinkButton),
                        new SelectMenuOptionBuilder()
                            .setLabel("Ticket Button")
                            .setEmoji(Icons.Folder)
                            .setDescription("Create a button to open a server ticket.")
                            .setValue(ButtonTypes.TicketButton),
                        new SelectMenuOptionBuilder()
                            .setLabel("Verification Button")
                            .setEmoji(Icons.Shield)
                            .setDescription("Create a button to verify members.")
                            .setValue(ButtonTypes.VerificationButton)
                    )
            );

        const RoleSelectorComponent = new RoleSelector()
            .Configure(builder =>
                builder.setPlaceholder("Select a role")
            )
            .SetCustomId(Id.RoleSelector)
            .toActionRow();

        const Message = await interaction.reply({
            content: `${Icons.Tag} Select a button type below`,
            components: [
                ButtonTypeSelector
            ],
            ephemeral: true,
            fetchReply: true
        });

        const ButtonType = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            filter: Filter({
                member: interaction.member,
                customIds: [Id.ButtonTypeSelector]
            }),
            time: 0
        });

        const isRoleButton = ButtonType.values[0] == ButtonTypes.RoleButton;
        const isLinkButton = ButtonType.values[0] == ButtonTypes.LinkButton;
        const isTicketButton = ButtonType.values[0] == ButtonTypes.TicketButton;
        const isVerificationButton = ButtonType.values[0] == ButtonTypes.VerificationButton;
        let StyleReplyMessage: MessageComponentInteraction = ButtonType;
        let ButtonCustomId: string = isTicketButton ? `OPEN_TICKET` : `VERIFY_USER`;
        let SelectedRole: Role | APIRole;

        if (isRoleButton) {
            await ButtonType.update({
                content: `${Icons.Flag} Select a role below`,
                components: [
                    RoleSelectorComponent
                ],
                fetchReply: true
            });

            StyleReplyMessage = await Message.awaitMessageComponent({
                componentType: ComponentType.RoleSelect,
                filter: Filter({
                    member: interaction.member,
                    customIds: [Id.RoleSelector]
                }),
                time: 0
            });

            SelectedRole = (StyleReplyMessage as RoleSelectMenuInteraction).roles.first();

            // ~T~a~s~k~ (completed): Return error if the role is already there
            let isError = false;
            Target.components.forEach(row => {
                const result = ArrayUtils.AdvancedSearch<APIButtonComponent>(row.components.filter(e => e.type == ComponentType.Button) as APIButtonComponent[], (button) => {
                    if (isApiLinkButton(button)) {
                        return false;
                    } else {
                        return button.custom_id == `button-role:${SelectedRole.id}`;
                    }
                });
                if (result.Result == true) isError = true;
            });

            if (isError) {
                StyleReplyMessage.update({
                    components: [],
                    content: `${Icons.Configure} You can't have two buttons assigned the same role.`
                });
                return;
            }

            ButtonCustomId = `button-role:${SelectedRole.id}`;
        } else if (isLinkButton) {
            Button.setStyle(ButtonStyle.Link);
        }

        const ButtonReply = StyleReplyMessage != null ? StyleReplyMessage : ButtonType;
        await ButtonReply.update({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        ...((isVerificationButton || isTicketButton || isRoleButton) ? [
                            new ButtonBuilder()
                                .setCustomId(Id.DefaultValues)
                                .setLabel("Default Values")
                                .setStyle(ButtonStyle.Primary)
                        ] : []),
                        new ButtonBuilder()
                            .setCustomId(Id.CustomValues)
                            .setLabel("Select Values")
                            .setStyle(ButtonStyle.Secondary)
                    )
            ],
            content: `${Icons.Configure} Select button values`
        });

        const Value = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: Filter({
                member: interaction.member,
                customIds: [Id.CustomValues, Id.DefaultValues]
            }),
            time: 0
        });

        let ReplyTo: ButtonInteraction | ModalSubmitInteraction;
        if (Value.customId == Id.CustomValues) {
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

            let isError = false;
            Target.components.forEach(row => {
                const result = ArrayUtils.AdvancedSearch<APIButtonComponent>(row.components.filter(e => e.type == ComponentType.Button) as APIButtonComponent[], (button) => {
                    if (isApiLinkButton(button)) {
                        if (Fields.Link == null) return false;
                        return button.url == Fields.Link;
                    } else {
                        return false;
                    }
                });
                if (result.Result == true) isError = true;
            });

            if (isError) {
                Modal.reply({
                    components: [],
                    content: `${Icons.Configure} You can't have two buttons assigned the same role.`
                });
                return;
            }

            ReplyTo = Modal;
            ReplyMessage = Modal;
        } else {
            ReplyTo = Value;
            ReplyMessage = Value;
        }

        if (isTicketButton || isVerificationButton || isRoleButton) {
            Button.setCustomId(ButtonCustomId);
            if (Button.data?.label == null) {
                if (isTicketButton) {
                    Button.setLabel("Create Ticket")
                } else if (isVerificationButton) {
                    Button.setLabel("Verify")
                } else if (isRoleButton) {
                    Button.setLabel(SelectedRole.name)
                }
            }
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

                //@ts-expect-error this error doesn't matter
            /*const StyleMessage =*/ await (ReplyTo.isButton() ? ReplyTo.update : ReplyTo.reply)({
                    content: `${Icons.Tag} Select a button style`,
                    components: [ButtonStyles]
                });

            ReplyMessage = await Message.awaitMessageComponent({
                componentType: ComponentType.Button,
                filter: Filter({
                    member: interaction.member,
                    customIds: [
                        ButtonStyle[ButtonStyle.Success],
                        ButtonStyle[ButtonStyle.Danger],
                        ButtonStyle[ButtonStyle.Primary],
                        ButtonStyle[ButtonStyle.Secondary]
                    ]
                }),
                time: 0
            });

            Button.setStyle(ButtonStyle[ReplyMessage.customId as string]);
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
            content: `${Icons.Success} Successfully created button role.`,
            components: []
        };

        if (ReplyMessage.isButton()) {
            await ReplyMessage.update(Options);
        } else {
            await ReplyMessage.editReply({
                components: [],
                content: "\u200B"
            });

            await ReplyTo.reply(Options);
        }
    }
}