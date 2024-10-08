//dotenv stuff
import * as dotenv from "dotenv";
import readline from "readline";
dotenv.config();

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

console.log("press q to exit, or any key to print log");

process.stdin.on("keypress", (chunk, key) => {
  if (key && key.name == "q") {
    console.log("Exiting...".red);
    process.exit();
  } else if (key && key.name == "r") {
    console.log("Restarting...".yellow);
    const devProcess = spawn("yarn", ["dev"], {
      cwd: process.cwd(),
      stdio: "inherit",
    });
    devProcess.on("exit", (code) => {
      if (code === 0) {
        console.log("TypeScript rebuilt successfully.".green);
      } else {
        console.error("Error rebuilding TypeScript.".red);
      }
    });
    process.exit();
  }
});

export const TOKEN = process.env.TOKEN;
export const API_TOKEN = process.env.API_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const API_ENABLED = process.env.START_API;
export const DEVELOPER_BUILD =
  process.env?.DEV == null ? false : Boolean(process.env?.DEV);
export const USE_SSL = process.env?.SSL == "true" ? true : false;
export const API_PORT = Number(process.env?.API_PORT);
export const API_URL = process.env?.API_URL;
export const LOGSNAG_TOKEN = process.env?.LOGSNAG;
export const USE_LOGSNAG = process.env?.USE_LOGSNAG ?? false;
export const CLIENT_SECRET = process.env?.CLIENT_SECRET;

//Import packages
import {
  Client,
  IntentsBitField,
  Partials,
  Events,
  ClientOptions,
  Collection,
  PermissionFlagsBits,
} from "discord.js";
import { Deploy } from "./utils/deploy";
import { StartService } from "./utils/handler";
import KeyFileStorage from "key-file-storage";
import "colors";
import { API } from "./api/index";
import { Levels } from "./utils/levels";
import { InitializeProvider } from "./utils/Storage";
import { ErrorManager } from "./utils/error";
import { Api, Colors, LogSnagProject, Status } from "./configuration";
import { StartAutoDeleteService } from "./utils/AutoDelete";
import { Refresh } from "./utils/reminders";
import { CreateConfiguration, StartCustomBots } from "./utils/customBot";
import { Logger } from "./logger";
import { ChannelCounterService } from "./utils/ChannelCounters";
import { Logsnag } from "./utils/logsnag";
import { LogSnag as LogSnagClient } from "logsnag";
import { Verifiers } from "@airdot/verifiers";
import { Application, MapProvider } from "@airdot/linked-roles";
import { Routes } from "./api/api-types";
import {
  RefreshDiscordMetadata,
  RefreshMetadataService,
} from "./utils/metadata";
import { CommandDataManager } from "@utils/Commands";
import { LoggingService } from "@utils/logging";
import { spawn } from "child_process";

//Debug logs
//console.log("DEBUG LOG:".red, process.env)

export const DEFAULT_CLIENT_OPTIONS: ClientOptions = {
  intents: [...Object.values(IntentsBitField.Flags).map((e) => e as number)],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
    Partials.User,
  ],
};

export async function SetClientValues(client: Client) {
  await InitializeProvider(client); //KeyFileStorage("storage", false)
  client.commands = new Map();
  client.ContextMenus = new Map();
  client.DetailedCommands = [];
  client.Errors = new ErrorManager();
  client.Levels = new Levels(client.storage);
  client.LegacyStorage = KeyFileStorage("storage", false);
  client.QuickStorage = KeyFileStorage("cache", false);
  client.TriviaGames = new Collection();
  client.ColorCache = new Collection();
  client.LogSnag = new LogSnagClient({
    token: LOGSNAG_TOKEN,
    project: LogSnagProject,
  });

  client.LinkedRoles = new Application({
    clientSecret: CLIENT_SECRET,
    id: CLIENT_ID,
    redirectUri: `${Api}${Routes.LinkedRoles}`,
    token: TOKEN,
    //@ts-expect-error ...
    databaseProvider: new MapProvider(),
  });

  client.CommandManager = new CommandDataManager(client.DetailedCommands);
}

// Create Discord.js client
export const client = new Client(DEFAULT_CLIENT_OPTIONS);

// Get everything ready...
client.on(Events.ClientReady, async () => {
  await HandleBotStart();
  console.log(
    `Pages:
    • Dashboard: http://localhost:3000/
    • API: http://localhost:4000/`.gray
  );
});

export async function HandleAnyBotStart(
  ProvidedClient: Client,
  isCustom = true
) {
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

  // Deploy slash commands
  if (!isCustom) console.log("Deploying commands...".grey);
  Logger.info(`Deploying commands for ${ProvidedClient.user.username}...`);
  Deploy(ProvidedClient, !isCustom, isCustom).then(() => {
    if (!isCustom) console.log("Registered all commands successfully.".green);
    Logger.info(`Registered all commands for ${ProvidedClient.user.username}.`);
  });

  // Start command handler
  if (!isCustom) console.log("Starting handler service...".grey);
  Logger.info(`Starting ${ProvidedClient.user.username}'s command handler.`);
  StartService(ProvidedClient);

  // Start auto delete service
  StartAutoDeleteService(ProvidedClient);

  // Channel Counter
  ChannelCounterService(ProvidedClient);

  // Refresh reminders
  Refresh(ProvidedClient);

  // Fetch current guild's colors
  (async () => {
    const Guilds = await client.Storage.Configuration.GetAll();
    Guilds.map((e) => {
      if (e.Premium && Verifiers.HexColor(e.Color)) {
        ProvidedClient.ColorCache.set(e.Id, e.Color);
      }
    });
  })();

  // Fetch Beep Boop's role in guilds
  (async () => {
    try {
      const Guilds = await client.guilds.fetch({ limit: 0 });
      Guilds.forEach(async (guild) => {
        if (guild.permissions.has(PermissionFlagsBits.ManageRoles)) {
          try {
            const fetched = await guild.fetch();
            const find = fetched.roles.cache.find(
              (e) => e.name == "Beep Boop" && e.managed
            );
            if (find == null) return;
            const fetchedRole = await fetched.roles.fetch(find.id);
            if (fetchedRole.editable)
              fetchedRole.edit({
                color: Colors.BrandColor,
              });
          } catch {
            //
          }
        }
      });
    } catch {
      //
    }
  })();

  // Metadata
  RefreshDiscordMetadata(ProvidedClient);
  RefreshMetadataService(ProvidedClient);

  // Logging
  LoggingService(ProvidedClient);

  ProvidedClient.on(Events.Error, console.log);
}

export async function HandleBotStart() {
  // Getting the bot ready
  console.log("Getting everything ready...".green);

  await HandleAnyBotStart(client, false);

  // Start Custom Bots
  StartCustomBots(client);

  // Logsnag
  Logsnag(client);

  // Start API
  console.log("Starting API...".grey);
  if (API_ENABLED == null || API_ENABLED == "true")
    (async () => {
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
    console.log("Updating status".gray);
    client.user.setActivity(Status);
  } else console.warn("You haven't set up a custom status".yellow);
}

client.login(TOKEN);
