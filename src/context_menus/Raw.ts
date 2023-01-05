import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, AnyComponentBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Client, codeBlock, ComponentType, ContextMenuCommandType, EmbedBuilder, Emoji, inlineCode, MessageActionRowComponentBuilder, MessageComponentBuilder, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder, spoiler, TextInputBuilder, TextInputStyle, time, TimestampStyles, WebhookClient } from "discord.js";
import { Embed, Emojis, Icons, Permissions } from "../configuration";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { CreateLinkButton } from "../utils/buttons";
import { Verifiers } from "../utils/verify";
import { Filter } from "../utils/filter";
import e from "express";
import { ChannelSelectMenu, EmbedFrom, EmbedModal, EmbedModalFields, MessageBuilderModal as CreateMessageModal } from "../utils/components";
import { generateId } from "../utils/Id";
import { FindLegacyWebhook, FindWebhook } from "../utils/Webhook";
import { GenerateURL, ShortenURL } from "../utils/Discohook";
import { CreatePaste } from "../utils/Vaultbin";

export default class Migrate extends ContextMenu {
    constructor() {
        super({
            Name: "Migrate Message",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Type: ApplicationCommandType.Message,
            ClientPermissions: []
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        const webhook = await FindLegacyWebhook(interaction.targetId, interaction.channel.id, client);
        if (webhook == null) {
            FriendlyInteractionError(interaction, "Couldn't find webhook to sync with.")
            return;
        }

        await client.Storage.CustomWebhooks.Create({
            channelId: interaction.channel.id,
            url: webhook.url
        });

        await interaction.reply({
            ephemeral: true,
            content: "Custom message synced with database."
        })
    }
}