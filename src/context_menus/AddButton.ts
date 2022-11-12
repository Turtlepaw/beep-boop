import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonComponent, ButtonStyle, Client, ComponentType, ContextMenuCommandType, MessageActionRowComponent, MessageActionRowComponentBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits, RepliableInteraction, SelectMenuBuilder, SelectMenuOptionBuilder } from "discord.js";
import { Filter } from "../utils/filter";
import { Emojis } from "../configuration";
import { ButtonBuilderModal } from "../utils/components";

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
            EmojiField = "BUTTON_EMOJI_FIELD"
        }
        const Target = interaction.targetMessage;
        const ButtonModal = ButtonBuilderModal(ModalId.Modal, {
            Emoji: ModalId.EmojiField,
            Label: ModalId.LabelField
        });
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
            content: `${Emojis.Role} Select a role below`,
            components: [
                RoleSelector
            ],
            ephemeral: true,
            fetchReply: true
        });

        const Select = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            filter: Filter(interaction.member, "ROLE_SELECT"),
            time: 0
        });

        const Role = await interaction.guild.roles.fetch(Select.values[0]);
        const Button = new ButtonBuilder()
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

        const Style = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: Filter(interaction.member,
                ButtonStyle[ButtonStyle.Success],
                ButtonStyle[ButtonStyle.Danger],
                ButtonStyle[ButtonStyle.Primary],
                ButtonStyle[ButtonStyle.Secondary]
            ),
            time: 0
        });

        Button.setStyle(ButtonStyle[Style.customId]);

        Style.update({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("DEFAULT_VALUES")
                            .setLabel("Default Values")
                            .setStyle(ButtonStyle.Primary),
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
            Value.showModal(ButtonModal);

            const Modal = await Value.awaitModalSubmit({
                time: 0
            });

            const Fields = {
                Label: Modal.fields.getTextInputValue(ModalId.LabelField),
                Emoji: Modal.fields.getTextInputValue(ModalId.EmojiField)
            }

            Button.setLabel(Fields.Label)
            if (Fields.Emoji != '') Button.setEmoji(Fields.Emoji);

            ReplyTo = Modal;
        } else {
            ReplyTo = Value;
        }

        await Target.edit({
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
            await Style.editReply({
                components: [],
                content: "\u200B"
            });

            await ReplyTo.reply(Options);
        }
    }
}