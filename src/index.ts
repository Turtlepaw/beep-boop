//Import packages
import { Client, IntentsBitField, Partials, Events } from "discord.js";
import { token } from "./configuration";
import { Deploy } from "./deploy";
import { StartService } from "./handler";
//dotenv stuff
import * as dotenv from 'dotenv';
dotenv.config()
//Import files & packages
import "./configuration";
import "colors";
//Debug logs
console.log("DEBUG LOG:".red, process.env)

//Create Discord.js client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds
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
    client.commands = new Map();
    client.ContextMenus = new Map();
    client.DetailedCommands = [];
    await Deploy(client).then(() => console.log("Registered all commands successfully.".green));
    await StartService(client)
    console.log("Ready".green)
});

client.login(token);