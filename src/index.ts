//Import packages
import { Client, IntentsBitField, Partials, Events, PresenceUpdateStatus, PresenceStatusData } from "discord.js";
import { Deploy } from "./utils/deploy";
import { StartService } from "./utils/handler";
import KeyFileStorage from "key-file-storage";
//dotenv stuff
import * as dotenv from 'dotenv';
dotenv.config()
import "colors";
import { API } from "./utils/api";
import { Levels } from "./utils/levels";
import { InitializeProvider, StorageManager } from "./utils/storage";
import { ErrorManager } from "./utils/error";
import { Status } from "./configuration";
import { StartAutoDeleteService } from "./utils/AutoDelete";
import { Refresh } from "./utils/reminders";
import { StartCustomBots } from "./utils/customBot";

//Debug logs
//console.log("DEBUG LOG:".red, process.env)

export const TOKEN = process.env.TOKEN;
export const API_TOKEN = process.env.API_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const DEVELOPER_BUILD = process.env?.DEV == "true" ?? false;
export const DEFAULT_CLIENT_OPTIONS = {
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
        Partials.User,
    ]
}

export async function SetClientValues(client: Client) {
    await InitializeProvider(client) //KeyFileStorage("storage", false)
    client.commands = new Map();
    client.ContextMenus = new Map();
    client.DetailedCommands = [];
    client.Errors = new ErrorManager();
    client.Levels = new Levels(client.storage);
    client.LegacyStorage = KeyFileStorage("storage", false);
}

// Create Discord.js client
const client = new Client(DEFAULT_CLIENT_OPTIONS);

// Get everything ready...
client.on(Events.ClientReady, HandleBotStart);

export async function HandleAnyBotStart(ProvidedClient: Client, isCustom = true) {
    // Set client values
    console.log("Setting client values...".grey);
    await SetClientValues(ProvidedClient);

    // Deploy slash commands
    if (!isCustom) console.log("Deploying commands...".grey);
    Deploy(ProvidedClient, !isCustom).then(() => isCustom ? console.log("Registered all commands successfully.".green) : null);

    // Start command handler
    console.log("Starting handler service...".grey);
    StartService(ProvidedClient)
}

export async function HandleBotStart() {
    // Getting the bot ready
    console.log("Getting everything ready...".green);

    await HandleAnyBotStart(client, false);

    // Start auto delete service
    StartAutoDeleteService(client);

    // Refresh reminders
    Refresh(client);

    // Start Custom Bots
    StartCustomBots(client);

    // Start API
    console.log("Starting API...".grey);
    API(client, API_TOKEN);

    // The client is ready
    console.log("Ready".green);

    // Set client status
    if (Status != null) {
        client.user.setActivity(Status);
    }
}

client.login(TOKEN);