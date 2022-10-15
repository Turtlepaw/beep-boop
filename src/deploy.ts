import { REST, SlashCommandBuilder, Routes, Client } from "discord.js";
import { clientId, guildId, token } from "./configuration";
import klawSync from "klaw-sync";
import CommandBuilder from "./lib/CommandBuilder";

export async function Deploy(client: Client) {
    const DeveloperCommands: any[] = [];
    const PublicCommands: any[] = [];

    const Files = klawSync("./dist/commands", { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });

    for (const File of Files) {
        const OriginalFile = require(File.path);
        const Command: CommandBuilder = new OriginalFile.default();
        client.commands.set(Command.Name, Command)

        if (Command.CanaryCommand) {
            DeveloperCommands.push(Command.Builder.toJSON());
        } else {
            PublicCommands.push(Command.Builder.toJSON());
        }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: DeveloperCommands })
        .then((data: any) => console.log(`Successfully registered ${data?.length} dev application commands.`))
        .catch(console.error);

    rest.put(Routes.applicationCommands(clientId), { body: PublicCommands })
        .then((data: any) => console.log(`Successfully registered ${data?.length} public application commands.`))
        .catch(console.error);
}