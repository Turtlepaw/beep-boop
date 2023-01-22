import { ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
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

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction) {
        await ViewProfile(interaction, true);
    }
}