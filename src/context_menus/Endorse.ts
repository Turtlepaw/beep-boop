import ContextMenu from "../lib/ContextMenuBuilder";
import { ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
import { EndorseUser } from "@commands/Other/Profile";

export default class Endorse extends ContextMenu {
    constructor() {
        super({
            Name: "Endorse User",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.User,
            ClientPermissions: []
        })
    }

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction) {
        const user = interaction.options.getUser("user");
        return EndorseUser(user, true, interaction);
    }
}