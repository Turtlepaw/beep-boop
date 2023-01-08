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
import { CustomBot } from "../models/CustomBot";
import { Gift } from "../models/Gift";
import { OAuth } from "../models/OAuth";
import { Action } from "../models/Action";
import { Error as CustomError } from "../models/Error";
import { Collection } from "discord.js";
import { TriviaGame } from "discord-trivia";

export interface StorageManagers {
    Configuration: GuildConfigurationManager;
    Profiles: StorageManager<Profile>;
    Reminders: StorageManager<Reminder>;
    CustomWebhooks: StorageManager<CustomWebhook>;
    Messages: StorageManager<Message>;
    CustomBots: StorageManager<CustomBot>;
    Gifts: StorageManager<Gift>;
    OAuth: StorageManager<OAuth>;
    Actions: StorageManager<Action>;
    Errors: StorageManager<CustomError>;
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
        CustomIcons: boolean;
        LogWebhook: WebhookClient;
        TriviaGames: Collection<string, TriviaGame>;
    }
}