import ContextMenu from "../lib/ContextMenuBuilder";
import { ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js";
import { InteractionError } from "../utils/error";
import { Icons } from "../configuration";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Legacy Quick Edit",
            CanaryCommand: true,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction) {
        return InteractionError({
            interaction,
            createError: false,
            ephemeral: true,
            message: `This command has been removed`,
            icon: Icons.Date
        });
    }
}