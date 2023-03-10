import { AttachmentBuilder, ChatInputCommandInteraction, ImageFormat, SlashCommandUserOption } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import Canvas, { createCanvas, registerFont } from "canvas";
import { FeedbackMessage } from "@utils/Feedback";
import { applyText } from "@utils/canvas";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Welcome a member with an custom image.",
            GuildOnly: false,
            Name: "welcome",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Images,
            Options: [
                new SlashCommandUserOption()
                    .setName("member")
                    .setDescription("The member to welcome.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        //await interaction.deferReply();
        const user = interaction.options.getUser("member", false) || interaction.user;
        const text = user.toString(); //image != null ? "an image" : (user.id == interaction.user.id ? "your avatar" : `${user}'s avatar`)
        await interaction.reply({
            content: `✨ Welcoming ${text}...`
        });

        const { width, height } = {
            width: 1600,
            height: 840
        };

        //const font = new Canvas.Font("Poppins-Medium", "./fonts/Poppins-Medium.ttf");
        registerFont("./fonts/Poppins-Medium.ttf", { family: "Poppins-Medium" });
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d');

        ctx.rect(0, 0, width, height);
        ctx.fillStyle = "#1e1f22";
        ctx.fillRect(0, 0, width, height);

        // Load images
        const Avatar = await Canvas.loadImage(
            user.avatarURL({
                extension: ImageFormat.PNG,
                size: 2048
            })
        );

        console.log(Avatar.width, Avatar.height)

        const scaleDownSize = 1.2;
        ctx.translate(-400, 0);
        // Draw Avatar
        ctx.save()
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Avatar.width * scaleDownSize / 2, 0, Math.PI * 2);
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(Avatar, (canvas.width - Avatar.width * scaleDownSize) / 2, (canvas.height - Avatar.height * scaleDownSize) / 2, Avatar.width * scaleDownSize, Avatar.height * scaleDownSize);
        ctx.restore()

        // Draw Member Count Text
        const memberText = `#${interaction.guild.memberCount}`;
        ctx.font = applyText(canvas, `${memberText}`, "Poppins-Medium", 100);
        //Select the text color
        ctx.fillStyle = '#ffffff';
        //Paint it on
        ctx.fillText(`${memberText}`, 1100, 200);

        // Draw Welcome Text
        const topText = `Welcome to the server`;
        ctx.font = applyText(canvas, `${topText}`, "Poppins-Medium", 60);
        //Select the text color
        ctx.fillStyle = '#ffffff';
        //Paint it on
        ctx.fillText(`${topText}`, 1050, 410);

        // Draw Text
        const username = interaction.user.username;
        ctx.font = applyText(canvas, `${username}`, "Poppins-Medium", 120);
        //Select the text color
        ctx.fillStyle = '#ffffff';
        //Paint it on
        ctx.fillText(`${username}`, 1050, 520);

        // Get image as PNG
        const PNG = canvas.toBuffer();

        const attachment = new AttachmentBuilder(PNG, { name: `welcome-${user.username.replaceAll(" ", "-")}.png` });
        const Feedback = new FeedbackMessage(interaction, "Welcome Messages");

        const Message = await interaction.editReply({
            files: [attachment],
            components: Feedback.components.toComponents(),
            content: `👋 Welcome ${text}`
        });

        await Feedback.collectFrom(Message);
    }
}