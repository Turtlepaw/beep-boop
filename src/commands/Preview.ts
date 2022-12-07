import { ActionRow, inlineCode, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "@airdot/verifiers";
import { CreateLinkButton } from "../utils/buttons";
import { GuildInformation, MemberInformation } from "../utils/info";
import { getScreenshot, ResolveURL } from "../utils/Web";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get an image preview of a website.",
            GuildOnly: false,
            Name: "preview",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Information,
            Options: [
                new SlashCommandStringOption()
                    .setName("website")
                    .setDescription("The url of the website.")
                    .setRequired(true),
                new SlashCommandBooleanOption()
                    .setName("hidden")
                    .setDescription("Make the reply visible only to you and hidden to everyone else.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        const Link = interaction.options.getString("website")
        const ephemeral = interaction.options.getBoolean("hidden") ?? true;

        await interaction.deferReply({ ephemeral })
        try {
            const Preview = await getScreenshot(null, ResolveURL(Link));
            const Attachment = new AttachmentBuilder(Preview);

            await interaction.editReply({
                files: [Attachment]
            });
        } catch (e) {
            return FriendlyInteractionError(interaction, `The website provided is not a valid url.\n\n${inlineCode(e)}`);
        }
    }
}
