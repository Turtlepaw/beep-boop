//Import packages
import { Client, IntentsBitField, Partials, Events } from "discord.js";
import { Deploy } from "./deploy";
import { StartService } from "./handler";
import KeyFileStorage from "key-file-storage";
//dotenv stuff
import * as dotenv from 'dotenv';
dotenv.config()
import "colors";
import { API } from "./api";
//Debug logs
//console.log("DEBUG LOG:".red, process.env)

export const TOKEN = process.env.TOKEN;
export const API_TOKEN = process.env.API_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;

console.log("DEBUG:".red, TOKEN)

//Create Discord.js client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
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
    console.log("Getting everything ready...".green);
    console.log("Registering commands...".grey);
    client.storage = KeyFileStorage("storage")
    client.commands = new Map();
    client.ContextMenus = new Map();
    client.DetailedCommands = [];
    await Deploy(client).then(() => console.log("Registered all commands successfully.".green));
    await StartService(client)
    console.log("Ready".green);

    await API(client, API_TOKEN);
});

client.login(TOKEN);