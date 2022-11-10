import { Client, Events as ClientEvents, InteractionReplyOptions } from "discord.js";
import klawSync from "klaw-sync";
import { Emojis } from "./configuration";
import ButtonBuilder, { ButtonBuilderOptions } from "./lib/ButtonBuilder";
import ContextMenu from "./lib/ContextMenuBuilder";
import EventBuilder from "./lib/Event";

async function StartEventService(client: Client) {
    try {
        //Find the event files
        const Files = klawSync("./dist/events", { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
        const Events: EventBuilder[] = [];
        for (const File of Files) {
            const OriginalFile = require(File.path);
            const Event: EventBuilder = new OriginalFile.default();
            Events.push(Event);
        }

        //Handle Event
        for (const Event of Events) {
            //@ts-expect-error
            client.on(Event.EventName, (...args) => Event.ExecuteEvent(client, ...args));
        }
    } catch (e) {
        console.log("Error:".red, e);
    }
}

async function StartButtonService(client: Client) {
    try {
        //Find the button files
        const Files = klawSync("./dist/buttons", { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
        const Buttons: ButtonBuilder[] = [];
        for (const File of Files) {
            const OriginalFile = require(File.path);
            const Button: ButtonBuilder = new OriginalFile.default();
            if (Button.CustomId.endsWith("{any}")) {
                //appealbtn_deny -> startswith_appealbtn
                Button.CustomId = "startwith_" + Button.CustomId.replace("_{any}", "");
            }
            Buttons.push(Button);
        }

        //Handle button interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isButton()) {
                let Id = interaction.customId;
                let CustomId: string = "";
                const Button = Buttons.find(e => {
                    if (e.RequireIdFetching) {
                        //Set Id to the custom id
                        const FullId = e.CustomId.replace("startwith_", "");
                        Id = interaction.customId.replace((e.CustomId.replace("startwith_", "")), "").replace("_", "")
                        //Check if it starts with the Id
                        if (interaction.customId.startsWith(FullId)) {
                            CustomId = interaction.customId;
                            return true;
                        };
                    } else {
                        if (e.CustomId == interaction.customId) {
                            CustomId = interaction.customId
                            return true;
                        } else return false;
                    }
                })
                const PermissionsMessage: InteractionReplyOptions = {
                    content: `${Emojis.Error} You don't have the required permissions to use this button.`,
                    ephemeral: true
                };
                if (!interaction.memberPermissions.any(Button.SomePermissions)) {
                    interaction.reply(PermissionsMessage);
                    return;
                }
                if (!interaction.memberPermissions.has(Button.RequiredPermissions)) {
                    interaction.reply(PermissionsMessage);
                    return;
                }
                if (CustomId != interaction.customId) return;
                Button.ExecuteInteraction(interaction, client, Id);
            }
        });
    } catch (e) {
        console.log("Error:".red, e);
    }
}

async function StartContextMenuService(client: Client) {
    try {
        const ContextMenus = Array.from(client.ContextMenus).map(e => e[1]);

        //Handle button interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isContextMenuCommand()) {
                const ContextMenu = ContextMenus.find(e => e.Name == interaction.commandName)
                ContextMenu.ExecuteContextMenu(interaction, client);
            }
        });
    } catch (e) {
        console.log("Error:".red, e);
    }
}

export async function StartService(client: Client) {
    try {
        //Handle command interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                const PermissionsMessage: InteractionReplyOptions = {
                    content: `${Emojis.Error} You don't have the required permissions to run this command.`,
                    ephemeral: true
                };
                if (!interaction.memberPermissions.any(command.SomePermissions)) {
                    interaction.reply(PermissionsMessage);
                    return;
                }
                if (!interaction.memberPermissions.has(command.RequiredPermissions)) {
                    interaction.reply(PermissionsMessage);
                    return;
                }

                command?.ExecuteCommand(interaction, client);
            }
        })
    } catch (e) {
        console.log("Error:".red, e);
    }

    //Start other services
    StartButtonService(client);
    StartEventService(client);
    StartContextMenuService(client);
}