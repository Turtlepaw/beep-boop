import ContextMenu from "../lib/ContextMenuBuilder";
import Command from "../lib/CommandBuilder";

declare module 'discord.js' {
    interface Client {
        commands: Map<string, Command>,
        DetailedCommands: {
            Id: string,
            Name: string
        }[],
        ContextMenus: Map<string, ContextMenu>
    }
}