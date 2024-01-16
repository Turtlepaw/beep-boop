import ContextMenu from "../lib/ContextMenuBuilder";
import Command from "../lib/CommandBuilder";
import { KeyFileStorage } from "key-file-storage/dist/src/key-file-storage";
import { Levels as LevelManager } from "../utils/levels";
import { GuildConfigurationManager, StorageManager } from "../utils/Storage";
import { ErrorManager } from "../utils/error";
import { DataSource } from "typeorm";
// Import Models...
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
import { APIUser } from "../models/APIUser";
import { Ticket } from "../models/Ticket";
import LogSnag from "logsnag";
import { Application as LinkedRolesApp } from "@airdot/linked-roles";
import { CommandDataManager } from "@utils/Commands";
import { ApiCommandData } from "@utils/deploy";
import { Cache } from "../models/Cache";

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
    ApiUsers: StorageManager<APIUser>;
    Tickets: StorageManager<Ticket>;
    ImageCache: StorageManager<Cache<string>>;
}

declare module 'discord.js' {
    interface Client {
        commands: Map<string, Command>,
        DetailedCommands: ApiCommandData[],
        ContextMenus: Map<string, ContextMenu>;
        storage: DataSource; //KeyFileStorage;
        Levels: LevelManager;
        Storage: StorageManagers;
        Errors: ErrorManager;
        LegacyStorage: KeyFileStorage;
        QuickStorage: KeyFileStorage;
        CustomIcons: boolean;
        LogWebhook: WebhookClient;
        TriviaGames: Collection<string, TriviaGame>;
        ColorCache: Collection<string, HexColorString>;
        LogSnag: LogSnag;
        LinkedRoles: LinkedRolesApp;
        CommandManager: CommandDataManager;
        ImageCache: Map<string, Buffer>;
    }
}