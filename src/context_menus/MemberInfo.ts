import ContextMenu from "../lib/ContextMenuBuilder";
import { ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
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

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction) {
        await MemberInformation(
            interaction,
            interaction.targetUser,
            true
        );
    }
}