import { ActionRow, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, ImageFormat, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandUserOption, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
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
            SomePermissions: [],
            Category: Categories.Images,
            Options: [
                new SlashCommandAttachmentOption()
                    .setName("image")
                    .setDescription("The image to snowify."),
                new SlashCommandUserOption()
                    .setName("member")
                    .setDescription("The member to snowify.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        //await interaction.deferReply();
        const user = interaction.options.getUser("member", false) || interaction.user;
        const image = interaction.options.getAttachment("image", false);
        const text = image != null ? "an image" : (user.id == interaction.user.id ? "your avatar" : `${user}'s avatar`)
        await interaction.reply({
            content: `✨ Snowifying ${text}...`
        })

        const canvas = createCanvas(200, 200)
        const ctx = canvas.getContext('2d');

        // Load images
        const Avatar = await Canvas.loadImage(
            image == null ? user.avatarURL({
                extension: ImageFormat.PNG,
                size: 2048
            }) : image.url
        );
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