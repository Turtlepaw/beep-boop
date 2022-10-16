import { Client, Events } from "discord.js";
import klawSync from "klaw-sync";
import ButtonBuilder, { ButtonBuilderOptions } from "./lib/ButtonBuilder";
import ContextMenu from "./lib/ContextMenuBuilder";

async function StartEventService(client: Client) {
    try {
        //Find the event files
        const Files = klawSync("./dist/buttons", { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
        const Buttons: ButtonBuilder[] = [];
        for (const File of Files) {
            const OriginalFile = require(File.path);
            const Button: ButtonBuilder = new OriginalFile.default();
            Buttons.push(Button);
        }

        //Handle button interactions
        client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isButton()) {
                const Button = Buttons.find(e => e.CustomId == interaction.customId)
                if (Button?.CustomId != interaction.customId) return;
                Button.ExecuteInteraction(interaction, client);
            }
        });
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
            Buttons.push(Button);
        }

        //Handle button interactions
        client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isButton()) {
                const Button = Buttons.find(e => e.CustomId == interaction.customId)
                if (Button?.CustomId != interaction.customId) return;
                Button.ExecuteInteraction(interaction, client);
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
        client.on(Events.InteractionCreate, async (interaction) => {
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
        client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
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