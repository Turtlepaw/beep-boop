import { REST, SlashCommandBuilder, Routes, Client } from "discord.js";
import { clientId, guildId, token } from "./configuration";
import klawSync from "klaw-sync";
import Command from "./lib/CommandBuilder";

export async function Deploy(client: Client) {
    const devCommands: any[] = [];
    const pubCommands: any[] = [];

    const CommandFiles = klawSync("./dist/commands", { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });

    for (const CommandFile of CommandFiles) {
        const rCommand = require(CommandFile.path);
        const command: Command = new rCommand.default();
        client.commands.set(command.Name, command)
        //@ts-expect-error
        if (!command || command?.isCommand == false) continue;

        if (command.CanaryCommand) {
            devCommands.push(command.Builder.toJSON());
        } else {
            pubCommands.push(command.Builder.toJSON());
        }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: devCommands })
        .then((data: any) => console.log(`Successfully registered ${data?.length} dev application commands.`))
        .catch(console.error);

    rest.put(Routes.applicationCommands(clientId), { body: pubCommands })
        .then((data: any) => console.log(`Successfully registered ${data?.length} public application commands.`))
        .catch(console.error);
}