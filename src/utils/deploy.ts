import { REST, Routes, Client, APIApplicationCommand } from "discord.js";
import { BaseDirectory, guildId } from "../configuration";
import klawSync from "klaw-sync";
import CommandBuilder from "../lib/CommandBuilder";
import ContextMenu from "../lib/ContextMenuBuilder";
import { Logger } from "../logger";
import { Omit } from "./Configure";

// interface ApiCommandData {
//     id: string;
//     name: string;
// }

export type ApiCommandData = Omit<APIApplicationCommand, "dm_permission">;

export async function Deploy(client: Client, logs = true, isCustom: boolean) {
  if (typeof client.token != "string")
    return console.warn("No token present, not deploying commands".red);
  const DeveloperCommands: object[] = [];
  const PublicCommands: object[] = [];
  const clientId = client.user.id;

  const Files = klawSync(`${BaseDirectory}/commands`, {
    nodir: true,
    traverseAll: true,
    filter: (f) => f.path.endsWith(".js"),
  });

  for (const File of Files) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const OriginalFile = require(File.path);
    const Command: CommandBuilder = new OriginalFile.default();
    client.commands.set(Command.Name, Command);

    if (Command.CanaryCommand) {
      DeveloperCommands.push(Command.Builder.toJSON());
    } else {
      PublicCommands.push(Command.Builder.toJSON());
    }
  }

  const ContextMenuFiles = klawSync(`${BaseDirectory}/context_menus`, {
    nodir: true,
    traverseAll: true,
    filter: (f) => f.path.endsWith(".js"),
  });
  const ContextMenus: ContextMenu[] = [];
  for (const File of ContextMenuFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const OriginalFile = require(File.path);
    const ContextMenu: ContextMenu = new OriginalFile.default();
    ContextMenus.push(ContextMenu);
    client.ContextMenus.set(ContextMenu.Name, ContextMenu);
  }

  ContextMenus.forEach((e) => {
    if (e.CanaryCommand) {
      DeveloperCommands.push(e.Builder.toJSON());
    } else {
      PublicCommands.push(e.Builder.toJSON());
    }
  });

  const rest = new REST({ version: "10" }).setToken(client.token); //token);

  if (!isCustom)
    rest
      .put(Routes.applicationGuildCommands(clientId, guildId), {
        body: DeveloperCommands,
      })
      .then((data: ApiCommandData[]) => {
        if (logs)
          console.log(
            `Successfully registered ${data?.length} dev application commands.`
          );
        Logger.info(
          `Registered application commands (dev) for ${client.user.tag}.`
        );
        for (const CommandData of data) {
          client.DetailedCommands.push(CommandData);
        }
      })
      .catch(console.error);

  rest
    .put(Routes.applicationCommands(clientId), { body: PublicCommands })
    .then((data: ApiCommandData[]) => {
      if (logs)
        console.log(
          `Successfully registered ${data?.length} public application commands.`
        );
      Logger.info(
        `Registered application commands (global) for ${client.user.tag}.`
      );
      for (const CommandData of data) {
        client.DetailedCommands.push(CommandData);
      }
    })
    .catch(console.error);
}
