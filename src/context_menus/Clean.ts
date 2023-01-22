import ContextMenu from "../lib/ContextMenuBuilder";
import { ApplicationCommandType, UserContextMenuCommandInteraction, inlineCode } from "discord.js";
import { Embed, Icons } from "../configuration";
import { CleanMember } from "../utils/Clean";
import { Verifiers } from "@airdot/verifiers";
import { InteractionError } from "../utils/error";

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

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction) {
        if (!Verifiers.Discord.Member(interaction.targetMember)) {
            return await InteractionError({
                interaction,
                error: "Member provided failed verifiers (returned API member instead of Discord.js member)"
            });
        }

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