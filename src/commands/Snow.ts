import { ActionRow, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, ImageFormat, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandChannelOption, SlashCommandStringOption, Webhook, WebhookClient } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import Jimp from "jimp";

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
        const Image = await Jimp.read(interaction.user.avatarURL({
            extension: ImageFormat.PNG,
            size: 1024
        }));

        const Overlay = await Jimp.read("./src/images/snow.png");
        Image.blit(Overlay, 0, 0);
        const PNG = await Image.getBufferAsync(Jimp.MIME_PNG);

        const attachment = new AttachmentBuilder(PNG, { name: 'profile.png' });

        await interaction.editReply({ files: [attachment] });
    }
}