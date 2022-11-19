import ContextMenu from "../lib/ContextMenuBuilder";
import { Locale, ActionRowBuilder, time, ApplicationCommandType, ButtonBuilder, ButtonStyle, Client, ComponentType, ContextMenuCommandType, ImageFormat, MessageContextMenuCommandInteraction, PermissionFlagsBits, UserContextMenuCommandInteraction, TimestampStyles, codeBlock, blockQuote, inlineCode } from "discord.js";
import { Filter } from "../utils/filter";
import { CreateLinkButton } from "../utils/buttons";
import { Colors, Embed, Emojis, Icons } from "../configuration";
import { MemberInformation } from "../utils/info";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Member Information",
            CanaryCommand: false,
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.User
        })
    }

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction, client: Client) {
        await MemberInformation(
            interaction,
            interaction.targetUser,
            true
        );
    }
}