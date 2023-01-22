//Import packages
import { Client, IntentsBitField, Partials, Events, ClientOptions, Collection } from "discord.js";
import { Deploy } from "./utils/deploy";
import { StartService } from "./utils/handler";
import KeyFileStorage from "key-file-storage";
//dotenv stuff
import * as dotenv from 'dotenv';
import "colors";
import { API } from "./api/index";
import { Levels } from "./utils/levels";
import { InitializeProvider } from "./utils/storage";
import { ErrorManager } from "./utils/error";
import { Status } from "./configuration";
import { StartAutoDeleteService } from "./utils/AutoDelete";
import { Refresh } from "./utils/reminders";
import { CreateConfiguration, StartCustomBots } from "./utils/customBot";
import { Logger } from "./logger";
dotenv.config()

//Debug logs
//console.log("DEBUG LOG:".red, process.env)

export const TOKEN = process.env.TOKEN;
export const API_TOKEN = process.env.API_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const API_ENABLED = process.env.START_API;
export const DEVELOPER_BUILD = process.env?.DEV == "true" ?? false;
export const API_PORT = Number(process.env?.API_PORT);
export const API_URL = process.env?.API_URL;
export const DEFAULT_CLIENT_OPTIONS: ClientOptions = {
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildMessageReactions
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
    client.QuickStorage = KeyFileStorage("cache", false);
    client.TriviaGames = new Collection();
}

// Create Discord.js client
const client = new Client(DEFAULT_CLIENT_OPTIONS);

// Get everything ready...
client.on(Events.ClientReady, async () => {
    await HandleBotStart();
    console.log(`Pages:
    • Dashboard: http://localhost:3000/
    • API: http://localhost:4000/`.gray)
});

export async function HandleAnyBotStart(ProvidedClient: Client, isCustom = true) {
    // Set client values
    if (!isCustom) console.log("Setting client values...".grey);
    await SetClientValues(ProvidedClient);

    // CLEAR ALL CONFIGURATION FUNCTION (OLD):
    // const oldall = await ProvidedClient.Storage.Configuration.GetAll();
    // console.log(`${oldall.length} to delete`)
    // console.log("deleting every guild configuration");
    // (await ProvidedClient.guilds.fetch()).forEach(e => {
    //     console.log("deleting config for", e.name)
    //     ProvidedClient.Storage.Configuration.Delete({
    //         Id: e.id
    //     });
    // });

    // console.log("check if there's any left...")
    // const all = await ProvidedClient.Storage.Configuration.GetAll();
    // console.log(`there's ${all.length} left`)

    // Deploy slash commands
    if (!isCustom) console.log("Deploying commands...".grey);
    Logger.info(`Deploying commands for ${ProvidedClient.user.username}...`);
    Deploy(ProvidedClient, !isCustom, isCustom).then(() => {
        if (!isCustom) console.log("Registered all commands successfully.".green)
        Logger.info(`Registered all commands for ${ProvidedClient.user.username}.`);
    });

    // Start command handler
    if (!isCustom) console.log("Starting handler service...".grey);
    Logger.info(`Starting ${ProvidedClient.user.username}'s command handler.`);
    StartService(ProvidedClient)

    // Start auto delete service
    StartAutoDeleteService(ProvidedClient);

    // Refresh reminders
    Refresh(ProvidedClient);
}

export async function HandleBotStart() {
    // Getting the bot ready
    console.log("Getting everything ready...".green);

    await HandleAnyBotStart(client, false);

    // Start Custom Bots
    StartCustomBots(client);

    // Start API
    console.log("Starting API...".grey);
    if (API_ENABLED == null || API_ENABLED == "true") (async () => {
        try {
            await API(client, API_TOKEN);
        } catch (e) {
            console.log("Couldn't start API:", e);
        }
    })();

    // Create configuration for all servers
    CreateConfiguration(client);

    // The client is ready
    console.log("Ready".green);

    // Set client status
    if (Status != null) {
        client.user.setActivity(Status);
    }
}

client.login(TOKEN);