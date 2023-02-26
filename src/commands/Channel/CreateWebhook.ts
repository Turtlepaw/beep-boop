import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, inlineCode, PermissionFlagsBits, SlashCommandSubcommandBuilder, spoiler, Webhook, WebhookClient } from "discord.js";
import { Embed, Icons, Permissions } from "../../configuration";
import Command, { Categories } from "../../lib/CommandBuilder";
import { GenerateURL } from "../../utils/Discohook";
import { FriendlyInteractionError } from "../../utils/error";
import { Verifiers } from "../../utils/verify";

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
        await interaction.deferReply({ ephemeral: true });
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
                new Embed(interaction)
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
    }
}