import ContextMenu from "../lib/ContextMenuBuilder";
import { ApplicationCommandType, Client, ContextMenuCommandType, MessageContextMenuCommandInteraction, PermissionFlagsBits } from "discord.js";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Delete This",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        if (interaction.inGuild() && interaction.inCachedGuild() && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({
                content: "You're missing the required permissions to run this...",
                ephemeral: true
            });
        }
        await interaction.reply({
            content: "Successfully deleted the message.",
            ephemeral: true
        });
    }
}