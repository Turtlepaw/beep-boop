import { ActionRow, ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, Emoji, Message, MessageActivityType, ModalBuilder, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction, Webhook, WebhookClient } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Emojis, Icons } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal, MessageBuilderModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";
import { GuildInformation, MemberInformation } from "../utils/info";
import { Endorse, FetchUser, ResolveUser, SetBio, SetDisplayName } from "../utils/Profile";
import { Subscriptions } from "../models/Profile";
import ContextMenu from "../lib/ContextMenuBuilder";
import { ViewProfile } from "../commands/Profile";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Profile",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.User
        })
    }

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction, client: Client) {
        await ViewProfile(interaction, true);
    }
}