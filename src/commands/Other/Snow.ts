import { AttachmentBuilder, ChatInputCommandInteraction, ImageFormat, SlashCommandAttachmentOption, SlashCommandUserOption } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import Canvas, { createCanvas } from "canvas";
import { FeedbackMessage } from "@utils/Feedback";

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

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        //await interaction.deferReply();
        const user = interaction.options.getUser("member", false) || interaction.user;
        const image = interaction.options.getAttachment("image", false);
        const text = image != null ? "an image" : (user.id == interaction.user.id ? "your avatar" : `${user}'s avatar`)
        await interaction.reply({
            content: `✨ Snowifying ${text}...`
        });

        const CurrentCache = image == null ? await interaction.client.Storage.ImageCache.FindOneBy({
            key: user.id
        }) : null;

        if (CurrentCache != null) {
            const PNG = Buffer.from(CurrentCache.value, "base64");
            const attachment = new AttachmentBuilder(PNG, { name: 'cached.png' });
            const Feedback = new FeedbackMessage(interaction, "Cached Snowify");

            const Message = await interaction.editReply({
                files: [attachment],
                components: Feedback.components.toComponents()
            });

            await Feedback.collectFrom(Message);
            return;
        }

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

        if (image == null) await interaction.client.Storage.ImageCache.Create({
            key: user.id,
            value: PNG.toString("base64")
        });

        const attachment = new AttachmentBuilder(PNG, { name: 'snowy.png' });
        const Feedback = new FeedbackMessage(interaction, "Snowify");

        const Message = await interaction.editReply({
            files: [attachment],
            components: Feedback.components.toComponents()
        });

        await Feedback.collectFrom(Message);
    }
}