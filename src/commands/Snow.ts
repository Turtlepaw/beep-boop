import { ActionRow, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, ImageFormat, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandChannelOption, SlashCommandStringOption, Webhook, WebhookClient } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import Jimp from "jimp";
import Canvas, { createCanvas } from "canvas";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Add a snow overlay to your profile picture.",
            GuildOnly: false,
            Name: "snowify",
            RequiredPermissions: [],
            SomePermissions: []
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        //await interaction.deferReply();
        await interaction.reply({
            content: "✨ Snowifying your avatar..."
        })

        const canvas = createCanvas(200, 200)
        const ctx = canvas.getContext('2d')

        // Load images
        const Avatar = await Canvas.loadImage(interaction.user.avatarURL({
            extension: ImageFormat.PNG,
            size: 2048
        }));
        const Overlay = await Canvas.loadImage("./src/images/snow.png");

        // Draw images
        ctx.drawImage(Avatar, 0, 0, 200, 200);
        ctx.drawImage(Overlay, 0, 0, 200, 200);

        // Get image as PNG
        const PNG = canvas.toBuffer();

        const attachment = new AttachmentBuilder(PNG, { name: 'profile.png' });

        await interaction.editReply({ files: [attachment] });
    }
}