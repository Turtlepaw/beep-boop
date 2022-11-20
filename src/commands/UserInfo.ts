import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, Message, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption, Webhook, WebhookClient } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { MemberInformation } from "../utils/info";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information.",
            GuildOnly: false,
            Name: "user-info",
            RequiredPermissions: [],
            SomePermissions: [],
            Options: [
                new SlashCommandUserOption()
                    .setName("member")
                    .setDescription("The member to get information on."),
                new SlashCommandBooleanOption()
                    .setName("hidden")
                    .setDescription("Make the reply visible only to you and hidden to everyone else.")
            ]
            /*Subcomamnds: [
                new SlashCommandSubcommandBuilder()
                    .setName("info")
                    .setDescription("Get information on a user in this server.")
                    .addUserOption(e =>
                        e.setName("member")
                            .setDescription("The member to get information on.")
                    )
                    .addBooleanOption(e =>
                        e.setName("hidden")
                            .setDescription("Make the reply visible only to you and hidden to everyone else.")
                    )
            ]*/
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        await MemberInformation(
            interaction,
            interaction.options.getUser("member") || interaction.user,
            interaction.options.getBoolean("hidden") || false
        );
    }
}