import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { GuildInformation, MemberInformation } from "../utils/info";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information.",
            GuildOnly: false,
            Name: "server-info",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Information,
            Options: [
                new SlashCommandBooleanOption()
                    .setName("hidden")
                    .setDescription("Make the reply visible only to you and hidden to everyone else.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        await GuildInformation(
            interaction,
            interaction.guild,
            interaction.options.getBoolean("hidden") || false
        );
    }
}