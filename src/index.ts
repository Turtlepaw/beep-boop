//Import packages
import { Client, IntentsBitField, Partials, Events } from "discord.js";
import { Deploy } from "./utils/deploy";
import { StartService } from "./utils/handler";
import KeyFileStorage from "key-file-storage";
//dotenv stuff
import * as dotenv from 'dotenv';
dotenv.config()
import "colors";
import { API } from "./utils/api";
import { Levels } from "./utils/levels";
import { StorageManager } from "./utils/storage";
import { ErrorManager } from "./utils/error";

//Debug logs
//console.log("DEBUG LOG:".red, process.env)

export const TOKEN = process.env.TOKEN;
export const API_TOKEN = process.env.API_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;

export function SetClientValues(client: Client) {
    client.storage = KeyFileStorage("storage", false)
    client.commands = new Map();
    client.ContextMenus = new Map();
    client.DetailedCommands = [];
    client.Storage = new StorageManager(client.storage);
    client.Errors = new ErrorManager();
    client.Levels = new Levels(client.storage);
}

//Create Discord.js client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
        Partials.User
    ]
});

//Get everything ready...
client.on(Events.ClientReady, async () => {
    // Getting the bot ready
    console.log("Getting everything ready...".green);

    // Set client values
    console.log("Setting client values...".grey);
    SetClientValues(client);

    // Deploy slash commands
    console.log("Deploying commands...".grey);
    await Deploy(client).then(() => console.log("Registered all commands successfully.".green));

    // Start command handler
    console.log("Starting handler service...".grey);
    await StartService(client)

    // Start API
    console.log("Starting API...".grey);
    await API(client, API_TOKEN);

    // The client is ready
    console.log("Ready".green);
});

client.login(TOKEN);