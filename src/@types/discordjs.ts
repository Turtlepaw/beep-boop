import Command from "../lib/CommandBuilder";

declare module 'discord.js' {
    interface Client {
        commands: Map<string, Command>
    }
}