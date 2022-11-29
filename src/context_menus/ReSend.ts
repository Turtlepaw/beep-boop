import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, AnyComponentBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Client, codeBlock, ComponentType, ContextMenuCommandType, EmbedBuilder, Emoji, ImageFormat, inlineCode, MessageActionRowComponentBuilder, MessageComponentBuilder, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder, spoiler, TextChannel, TextInputBuilder, TextInputStyle, time, TimestampStyles, WebhookClient } from "discord.js";
import { Embed, Emojis, Icons } from "../configuration";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { CreateLinkButton } from "../utils/buttons";
import { Verifiers } from "../utils/verify";
import { Filter } from "../utils/filter";
import e from "express";
import { ChannelSelectMenu, EmbedFrom, EmbedModal, EmbedModalFields, MessageBuilderModal as CreateMessageModal } from "../utils/components";
import { generateId } from "../utils/Id";
import { FindWebhook } from "../utils/Webhook";
import { GenerateURL, ShortenURL } from "../utils/Discohook";
import fetch from "node-fetch";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Copy Message",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        await interaction.deferReply({ ephemeral: true })
        const Webhook = await (interaction.channel as TextChannel).createWebhook({
            name: interaction.targetMessage.author.username,
            avatar: interaction.targetMessage.author.avatarURL({ extension: ImageFormat.PNG, size: 2048 })
        });

        client.Storage.EditArray<string[]>(`custom_webhooks_${interaction.channel.id}`, [
            ...client.Storage.GetArray(`custom_webhooks_${interaction.channel.id}`),
            Webhook.url
        ]);

        const wbMessge = await Webhook.send({
            content: interaction.targetMessage.content,
            components: interaction.targetMessage.components,
            embeds: interaction.targetMessage.embeds,
            files: Array.from(interaction.targetMessage.attachments.values())
        })

        const url = await ShortenURL(wbMessge, Webhook);
        await interaction.editReply({
            embeds: [
                new Embed()
                    .setDescription(`${spoiler(inlineCode(Webhook.url))}`)
                    .setTitle(`${Icons.Success} Webhook Created`)
                    .addFields([{
                        name: `${Icons.Flag} Keep this secret!`,
                        value: `Someone with this URL can send any message they want to ${interaction.channel}, including ${inlineCode(`@everyone`)} mentions.`
                    }])
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Open in Discohook")
                            .setStyle(ButtonStyle.Link)
                            .setURL(
                                url.url//GenerateURL({ Webhook })
                            )
                    )
            ],
            //ephemeral: true
        });
    }
}