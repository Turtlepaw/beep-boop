import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, ContextMenuCommandType, EmbedBuilder, Emoji, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Emojis } from "../configuration";
import { FriendlyInteractionError, SendError } from "../error";
import { CreateLinkButton } from "../buttons";
import { Verifiers } from "../verify";
import { Filter } from "../filter";

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
        if (interaction.targetMessage.author.id != client.user.id) {
            return FriendlyInteractionError(interaction, "That message wasn't sent by me");
        }
        if (
            interaction.targetMessage.components[0]?.components == null ||
            interaction.targetMessage.components[0].components.find(e => e.customId == "OPEN_TICKET") == null
        ) {
            return FriendlyInteractionError(interaction, "That's not a ticket message");
        }
        enum CustomIds {
            MoveEmbed = "MOVE_EMBED",
            EditEmbed = "EDIT_EMBED",
            ChannelSelect = "SELECT_CHANNEL_MENU",
            EmbedModal = "EMBED_BUILDER_MODAL",
            TitleField = "EMBED_TITLE_FIELD",
            DescriptionField = "EMBED_DESCRIPTION_FIELD",
            ColorField = "EMBED_COLOR_FIELD",
            FooterField = "EMBED_FOOTER_FIELD"
        }

        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Edit Embed")
                    .setCustomId(CustomIds.EditEmbed)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel("Move Embed")
                    .setCustomId(CustomIds.MoveEmbed)
                    .setStyle(ButtonStyle.Secondary)
            );
        const Modal = new ModalBuilder()
            .setCustomId(CustomIds.EmbedModal)
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

        const ButtonInteraction = await interaction.channel.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0,
            filter: Filter(interaction.member, CustomIds.EditEmbed, CustomIds.MoveEmbed)
        });

        if (ButtonInteraction.customId == CustomIds.EditEmbed) {
            await ButtonInteraction.showModal(Modal);
            const ModalInteraction = await ButtonInteraction.awaitModalSubmit({
                time: 0
            });
            const { targetMessage } = interaction;
            const targetEmbed = targetMessage.embeds[0];
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
        }
    }
}