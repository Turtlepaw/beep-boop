import ContextMenu from "../lib/ContextMenuBuilder";
import Command from "../lib/CommandBuilder";
import { KeyFileStorage } from "key-file-storage/dist/src/key-file-storage";
import { Levels as LevelManager } from "../utils/levels";
import { StorageManager } from "../utils/storage";
import { ErrorManager } from "../utils/error";

declare module 'discord.js' {
    interface Client {
        commands: Map<string, Command>,
        DetailedCommands: {
            Id: string,
            Name: string
        }[],
        ContextMenus: Map<string, ContextMenu>;
        storage: KeyFileStorage;
        Levels: LevelManager;
        Storage: StorageManager;
        Errors: ErrorManager;
    }
}