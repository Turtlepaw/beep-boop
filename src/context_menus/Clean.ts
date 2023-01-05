import ContextMenu from "../lib/ContextMenuBuilder";
import { Locale, ActionRowBuilder, time, ApplicationCommandType, ButtonBuilder, ButtonStyle, Client, ComponentType, ContextMenuCommandType, ImageFormat, MessageContextMenuCommandInteraction, PermissionFlagsBits, UserContextMenuCommandInteraction, TimestampStyles, codeBlock, blockQuote, inlineCode } from "discord.js";
import { Filter } from "../utils/filter";
import { CreateLinkButton } from "../utils/buttons";
import { Colors, Embed, Emojis, Icons } from "../configuration";
import { MemberInformation } from "../utils/info";
import { CleanMember } from "../utils/Clean";
import { Verifiers } from "@airdot/verifiers";
import { FriendlyInteractionError, InteractionError } from "../utils/error";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Clean Nickname",
            CanaryCommand: false,
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["ManageNicknames"],
            Type: ApplicationCommandType.User
        })
    }

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction, client: Client) {
        if (!Verifiers.Discord.Member(interaction.targetMember)) {
            return await InteractionError({
                interaction,
                error: "Member provided failed verifiers (returned API member instead of Discord.js member)"
            });
        };

        const cleaned = await CleanMember(interaction.targetMember);
        await interaction.reply({
            content: `${Icons.Flag} Cleaned up their username.`,
            ephemeral: true,
            embeds: [
                new Embed(interaction.guild)
                    .setDescription(`${inlineCode(interaction.targetMember.user.username)} -> ${inlineCode(cleaned)}`)
            ]
        });
    }
}