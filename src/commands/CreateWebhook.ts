import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, inlineCode, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, spoiler, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Emojis, Icons, Permissions } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { GenerateURL } from "../utils/Discohook";

export default class Send extends Command {
    constructor() {
        const Description = "Create a webhook for sending messages with buttons.";
        super({
            CanaryCommand: false,
            Description,
            GuildOnly: false,
            Name: "webhook",
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Category: Categories.Server,
            ClientPermissions: [PermissionFlagsBits.ManageWebhooks],
            Subcommands: [
                new SlashCommandSubcommandBuilder()
                    .setName("create")
                    .setDescription(Description)
                    .addChannelOption(option =>
                        option.setName("channel")
                            .setDescription("The channel to create the webhook.")
                    )
                    .addStringOption(option =>
                        option.setName("webhook_name")
                            .setDescription("The name of the webhook that will appear on top of the message.")
                    )
                    .addStringOption(option =>
                        option.setName("webhook_avatar_url")
                            .setDescription("The avatar url of the webhook that will appear on top of the message."))
                    .addStringOption(option =>
                        option.setName("webhook_avatar_emoji")
                            .setDescription("Set a CUSTOM Discord emoji as the webhook's avatar.")
                    )
                    .addAttachmentOption(option =>
                        option.setName("webhook_avatar")
                            .setDescription("Drag 'n drop the avatar for the webhook")
                    )
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        const Message = await interaction.deferReply({ ephemeral: true, fetchReply: true });
        const Channel = interaction.options.getChannel("channel", false) || interaction.channel;
        if (!Verifiers.GuildText(Channel)) return FriendlyInteractionError(interaction, "Channel must be a text channel.")
        if (!Verifiers.TextChannel(Channel)) return FriendlyInteractionError(interaction, "API Channel recived")

        const Webhooks = await Channel.fetchWebhooks();

        if (Webhooks.size == 10) return FriendlyInteractionError(interaction, "There's too many webhooks in this channel, delete one and try again.")
        const WebhookName = interaction.options.getString("webhook_name", false) || interaction.guild.name;
        const WebhookURL = interaction.options.getString("webhook_url", false);
        let Webhook: WebhookClient | Webhook;
        // to-do: show them the webhook url and tell them to save it
        // so than they can put it in `webhook_url`
        // oh and verify that it was created by beep boop
        // so than the buttons work
        if (WebhookURL == null) {
            const AvatarEmoji = interaction.options.getString("webhook_avatar_emoji", false);
            const AvatarImage = interaction.options.getAttachment("webhook_avatar", false);
            const AvatarURL = interaction.options.getString("webhook_avatar_url", false);
            const isEmoji = !Verifiers.String(AvatarURL) && AvatarEmoji != null && AvatarImage == null;
            const isURL = !Verifiers.String(AvatarEmoji) && AvatarURL != null && AvatarImage == null;
            if (isEmoji && !Verifiers.Emoji(AvatarEmoji)) return FriendlyInteractionError(interaction, "The emoji must be a custom emoji.");
            if (isURL && !Verifiers.Link(AvatarURL)) return FriendlyInteractionError(interaction, "Invalid avatar URL.");
            let emoji: string = null;
            if (isEmoji) {
                const url = await interaction.guild.emojis.fetch(
                    AvatarEmoji.substring(AvatarEmoji.lastIndexOf(":") + 1, AvatarEmoji.length - 1)
                );
                emoji = url.url;
            }
            const WebhookAvatar = (emoji || AvatarURL || AvatarImage?.url) || interaction.guild.iconURL();
            Webhook = await Channel.createWebhook({
                name: WebhookName,
                avatar: WebhookAvatar
            });
        } else {
            Webhook = new WebhookClient({ url: WebhookURL });
        }

        await interaction.editReply({
            embeds: [
                new Embed(interaction.guild)
                    .setDescription(`${spoiler(inlineCode(Webhook.url))}`)
                    .setTitle(`${Icons.Configure} Webhook Created`)
                    .addFields([{
                        name: `${Icons.Flag} Keep this secret!`,
                        value: `Someone with this URL can send any message they want to ${Channel}, including ${inlineCode(`@everyone`)} mentions.`
                    }])
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Open in Discohook")
                            .setStyle(ButtonStyle.Link)
                            .setURL(
                                GenerateURL({ Webhook })
                            )
                    )
            ],
            //ephemeral: true
        });

        client.Storage.CustomWebhooks.Create({
            channelId: interaction.channel.id,
            url: Webhook.url
        });

        //client.Storage.Create(`custom_${SentMessage.id}`, Webhook.url);
        return;

        enum CustomId {
            AsMessage = "AS_MESSAGE_CONTENT",
            AsEmbed = "AS_EMBED_BUILDER",
            ContentField = "MESSAGE_CONTENT_FIELD",
            MessageModal = "MESSAGE_BUILDER_MODAL"
        }

        /*const MessageBuilder = MessageBuilderModal(
            CustomId.MessageModal,
            CustomId.ContentField,
            null
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

        await interaction.editReply({
            content: "Select an option below.",
            components: [Buttons],
            //fetchReply: true,
            //ephemeral: true
        });

        const Button = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter(interaction.member, CustomId.AsMessage, CustomId.AsEmbed)
        });

        await interaction.editReply({
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
            }) as Message;

            client.Storage.Create("custom_messages", [
                ...client.Storage.GetArray("custom_messages"),
                SentMessage.id
            ]);

            client.Storage.Create(`custom_${SentMessage.id}`, Webhook.url);

            await interaction.deleteReply();
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
            }) as Message;

            client.Storage.Create("custom_messages", [
                ...client.Storage.GetArray("custom_messages"),
                SentMessage.id
            ]);

            client.Storage.Create(`custom_${SentMessage.id}`, Webhook.url);

            await interaction.deleteReply();
            await Modal.reply({
                content: `${Emojis.Success} Successfully sent message`,
                ephemeral: true,
                components: [
                    CreateLinkButton(SentMessage.url, "Message")
                ]
            });
        }*/
    }
}