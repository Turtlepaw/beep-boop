import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, ComponentType, ImageFormat, SlashCommandAttachmentOption, SlashCommandUserOption } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import Canvas, { createCanvas } from "canvas";
import { Filter } from "../../utils/filter";
import { Icons, Logs } from "../../configuration";
import { Logger } from "../../logger";
import { Embed } from "../../utils/EmbedBuilder";

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

        enum FeedbackMood {
            Happy = "HAPPY",
            Ok = "OK",
            Sad = "SAD"
        }

        const FeedbackEmojis = {
            [FeedbackMood.Happy]: "😀",
            [FeedbackMood.Ok]: "🫤",
            [FeedbackMood.Sad]: "🙁"
        };

        const Message = await interaction.editReply({
            files: [attachment],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        Object.values(FeedbackMood).map(v =>
                            new ButtonBuilder()
                                .setEmoji(FeedbackEmojis[v])
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(v)
                        )
                    )
            ]
        });

        const Button = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0,
            filter: Filter({
                customIds: FeedbackMood,
                member: interaction.member
            })
        });

        await Button.reply({
            content: `${Icons.Success} Your feedback has been carefully recorded.`,
            ephemeral: true
        });

        try {
            const Guild = await Button.client.guilds.fetch(Logs.Guild);
            const Channel = await Guild.channels.fetch(Logs.Feedback);
            if (Channel.type != ChannelType.GuildText) return Logger.warn("The Logs.Feedback channel isn't a GuildText channel.");

            await Channel.send({
                embeds: [
                    new Embed(interaction.guild)
                        .setTitle("New Feedback Recorded")
                        .addFields([{
                            name: "Feedback",
                            value: FeedbackEmojis[Button.customId]
                        }, {
                            name: "User",
                            value: `${interaction.user.tag} (${interaction.user.id})`
                        }])
                ]
            });
        } catch (e) {
            console.warn("There was an error sending feedback, this could be due to the feedback log channel missing.");
            Logger.error(`Couldn't send feedback: ${e}`);
        }
    }
}