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
import fetch from "node-fetch";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Raw Message",
            CanaryCommand: false,
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
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        });

        const btn = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0
        });

        if (btn.customId == "FULL") {
            /*const res = await fetch("https://vaultb.in/api/pastes", {
                method: "post",
                body: JSON.stringify({
                    content: interaction.targetMessage.toJSON(),
                    language: "json"
                })
            });
            //const res = await raw.json();
            console.log(res)*/
            await btn.update({
                content: `Coming soon!`,
                components: []
            });
        } else {
            await btn.update({
                content: `${codeBlock(interaction.targetMessage.content)}`,
                components: []
            });
        }
    }
}