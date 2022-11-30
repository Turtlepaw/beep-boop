import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, AnyComponentBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Client, codeBlock, ComponentType, ContextMenuCommandType, EmbedBuilder, Emoji, inlineCode, MessageActionRowComponentBuilder, MessageComponentBuilder, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder, spoiler, TextInputBuilder, TextInputStyle, time, TimestampStyles, WebhookClient } from "discord.js";
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
import { CreatePaste } from "../utils/Vaultbin";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Raw Message",
            CanaryCommand: true,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        const Message = await interaction.reply({
            content: `Select a type.`,
            ephemeral: true,
            fetchReply: true,
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Full Raw Message")
                            .setCustomId("FULL")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("SHORT")
                            .setLabel("Message Content")
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId("FIX")
                            .setLabel("Sync Message")
                            .setStyle(ButtonStyle.Success)
                    )
            ]
        });

        const btn = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0
        });

        if (btn.customId == "FULL") {
            const res = await CreatePaste(JSON.stringify(interaction.targetMessage.toJSON()), "json")
            await btn.update({
                content: `${JSON.stringify(res)}`,
                components: []
            });
        } else if (btn.customId == "FIX") {
            const WebhookURL = client.Storage.Get<string>(`custom_${interaction.targetMessage.id}`);
            if (WebhookURL) {
                btn.update("Couldn't find webhook to sync with.")
                return;
            }
            client.Storage.EditArray<string[]>(`custom_webhooks_${interaction.channel.id}`, [
                ...client.Storage.GetArray(`custom_webhooks_${interaction.channel.id}`),
                WebhookURL
            ]);
            btn.update("☁️ Synced message with database.");
        } else {
            await btn.update({
                content: `${codeBlock(interaction.targetMessage.content)}`,
                components: []
            });
        }
    }
}