import ContextMenu from "../lib/ContextMenuBuilder";
import Command from "../lib/CommandBuilder";
import { KeyFileStorage } from "key-file-storage/dist/src/key-file-storage";
import { Levels as LevelManager } from "../utils/levels";
import { GuildConfigurationManager, StorageManager } from "../utils/storage";
import { ErrorManager } from "../utils/error";
import { DataSource } from "typeorm";
import { GuildConfiguration } from "../models/Configuration";
import { Profile } from "../models/Profile";
import { CustomWebhook } from "../models/Webhook";
import { Reminder } from "../models/Reminders";
import { Message } from "../models/Message";

export interface StorageManagers {
    Configuration: GuildConfigurationManager;
    Profiles: StorageManager<Profile>;
    Reminders: StorageManager<Reminder>;
    CustomWebhooks: StorageManager<CustomWebhook>;
    Messages: StorageManager<Message>;
}

declare module 'discord.js' {
    interface Client {
        commands: Map<string, Command>,
        DetailedCommands: {
            Id: string,
            Name: string
        }[],
        ContextMenus: Map<string, ContextMenu>;
        storage: DataSource; //KeyFileStorage;
        Levels: LevelManager;
        Storage: StorageManagers;
        Errors: ErrorManager;
        LegacyStorage: KeyFileStorage;
    }
}