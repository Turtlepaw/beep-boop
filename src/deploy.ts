import { REST, SlashCommandBuilder, Routes, Client } from "discord.js";
import { guildId } from "./configuration";
import klawSync from "klaw-sync";
import CommandBuilder from "./lib/CommandBuilder";
import ContextMenu from "./lib/ContextMenuBuilder";
import { CLIENT_ID as clientId, TOKEN as token } from "./index";

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

    const ContextMenuFiles = klawSync("./dist/context_menus", { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
    const ContextMenus: ContextMenu[] = [];
    for (const File of ContextMenuFiles) {
        const OriginalFile = require(File.path);
        const ContextMenu: ContextMenu = new OriginalFile.default();
        ContextMenus.push(ContextMenu);
        client.ContextMenus.set(ContextMenu.Name, ContextMenu);
    }

    ContextMenus.forEach(e => {
        if (e.CanaryCommand) {
            DeveloperCommands.push(e.Builder.toJSON())
        } else {
            PublicCommands.push(e.Builder.toJSON())
        }
    })

    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: DeveloperCommands })
        .then((data: any) => {
            console.log(`Successfully registered ${data?.length} dev application commands.`)
            for (const CommandData of data) {
                client.DetailedCommands.push({
                    Id: CommandData.id,
                    Name: CommandData.name
                });
            }
        })
        .catch(console.error);

    rest.put(Routes.applicationCommands(clientId), { body: PublicCommands })
        .then((data: any) => {
            console.log(`Successfully registered ${data?.length} public application commands.`)
            for (const CommandData of data) {
                client.DetailedCommands.push({
                    Id: CommandData.id,
                    Name: CommandData.name
                });
            }
        })
        .catch(console.error);
}