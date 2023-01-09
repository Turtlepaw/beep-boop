import { REST, SlashCommandBuilder, Routes, Client } from "discord.js";
import { BaseDirectory, guildId } from "../configuration";
import klawSync from "klaw-sync";
import CommandBuilder from "../lib/CommandBuilder";
import ContextMenu from "../lib/ContextMenuBuilder";
import { CLIENT_ID, TOKEN } from "../index";
import { Logger } from "../logger";

export async function Deploy(client: Client, logs = true, isCustom: boolean) {
    const DeveloperCommands: any[] = [];
    const PublicCommands: any[] = [];
    const clientId = client.user.id;
    const token = client.token;

    const Files = klawSync(`${BaseDirectory}/commands`, { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });

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

    const ContextMenuFiles = klawSync(`${BaseDirectory}/context_menus`, { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
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

    const rest = new REST({ version: '10' }).setToken(client.token) //token);

    if (!isCustom) rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: DeveloperCommands })
        .then((data: any) => {
            if (logs) console.log(`Successfully registered ${data?.length} dev application commands.`)
            Logger.info(`Registered application commands (dev) for ${client.user.tag}.`);
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
            if (logs) console.log(`Successfully registered ${data?.length} public application commands.`)
            Logger.info(`Registered application commands (global) for ${client.user.tag}.`);
            for (const CommandData of data) {
                client.DetailedCommands.push({
                    Id: CommandData.id,
                    Name: CommandData.name
                });
            }
        })
        .catch(console.error);
}