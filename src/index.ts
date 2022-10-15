import { Client, IntentsBitField, Partials, Events } from "discord.js";
import { token } from "./configuration";
import "colors";
import { Deploy } from "./deploy";
import { StartService } from "./handler";
import * as dotenv from 'dotenv';
dotenv.config()
import "./configuration";
console.log(process.env)

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


client.on(Events.ClientReady, async () => {
    console.log("Beep boop! I'm ready.".green);
    console.log("Registering commands...".grey);
    client.commands = new Map()
    await Deploy(client).then(() => console.log("Registered all commands successfully.".green));
    await StartService(client).then(() => {
        console.log("READY!".green)
    });
});

client.login(token);