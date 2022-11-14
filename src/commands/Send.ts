import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandChannelOption, SlashCommandStringOption } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Send a message as Beep Boop.",
            GuildOnly: false,
            Name: "send",
            RequiredPermissions: [],
            SomePermissions: ["ManageGuild"],
            Options: [
                new SlashCommandChannelOption()
                    .setName("channel")
                    .setDescription("The channel to send the message."),
                new SlashCommandStringOption()
                    .setName("webhook_name")
                    .setDescription("The name of the webhook that will send the message."),
                new SlashCommandStringOption()
                    .setName("webhook_avatar")
                    .setDescription("The avatar url of the webhook that will send the message.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        const Channel = interaction.options.getChannel("channel", false) || interaction.channel;
        if (Channel.type != ChannelType.GuildText) return FriendlyInteractionError(interaction, "Channel must be a text channel.")
        if (!Verifiers.TextChannel(Channel)) return FriendlyInteractionError(interaction, "API Channel recived")

        const Webhooks = await Channel.fetchWebhooks();

        if (Webhooks.size == 10) return FriendlyInteractionError(interaction, "There's too many webhooks in this channel, delete one and try again.")
        const WebhookName = interaction.options.getString("webhook_name", false) || interaction.guild.name;
        const WebhookAvatar = interaction.options.getString("webhook_avatar", false) || interaction.guild.iconURL();
        const Webhook = await Channel.createWebhook({
            name: WebhookName,
            avatar: WebhookAvatar
        });

        enum CustomId {
            AsMessage = "AS_MESSAGE_CONTENT",
            AsEmbed = "AS_EMBED_BUILDER",
            ContentField = "MESSAGE_CONTENT_FIELD",
            MessageModal = "MESSAGE_BUILDER_MODAL"
        }

        const MessageBuilder = MessageBuilderModal(
            CustomId.MessageModal,
            CustomId.ContentField
        );
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(CustomId.AsMessage)
                    .setLabel("As Message"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(CustomId.AsEmbed)
                    .setLabel("As Embed"),
            );

        const Message = await interaction.reply({
            content: "Select an option below.",
            components: [Buttons],
            fetchReply: true,
            ephemeral: true
        });

        const Button = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter(interaction.member, CustomId.AsMessage, CustomId.AsEmbed)
        });

        interaction.editReply({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        //@ts-expect-error
                        Button.message.components[0].components.map(e => ButtonBuilder.from(e).setDisabled(true))
                    )
            ]
        });

        if (Button.customId == CustomId.AsEmbed) {
            await Button.showModal(
                EmbedModal("EMBED_MODAL", Message)
            );

            const Modal = await Button.awaitModalSubmit({
                time: 0
            });

            const ModalEmbed = EmbedFrom(Modal);
            const SentMessage = await Webhook.send({
                embeds: [
                    ModalEmbed
                ]
            });

            client.Storage.Create("custom_messages", [
                ...client.Storage.GetArray("custom_messages"),
                SentMessage.id
            ]);

            client.Storage.Create(`custom_${SentMessage.id}`, Webhook.url);

            await Modal.reply({
                content: `${Emojis.Success} Successfully sent embed`,
                ephemeral: true,
                components: [
                    CreateLinkButton(SentMessage.url, "Message")
                ]
            });
        } else if (Button.customId == CustomId.AsMessage) {
            await Button.showModal(
                MessageBuilder
            );

            const Modal = await Button.awaitModalSubmit({
                time: 0
            });

            const Fields = {
                MessageContent: Modal.fields.getTextInputValue(CustomId.ContentField)
            };

            const SentMessage = await Webhook.send({
                content: Fields.MessageContent
            });

            client.Storage.Create("custom_messages", [
                ...client.Storage.GetArray("custom_messages"),
                SentMessage.id
            ]);

            client.Storage.Create(`custom_${SentMessage.id}`, Webhook.url);

            await Modal.reply({
                content: `${Emojis.Success} Successfully sent message`,
                ephemeral: true,
                components: [
                    CreateLinkButton(SentMessage.url, "Message")
                ]
            });
        }
    }
}