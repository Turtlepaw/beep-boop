import { Client, Events } from "discord.js";

export async function StartService(client: Client){
    client.on(Events.InteractionCreate, async (interaction) => {
        if(interaction.isChatInputCommand()){
            const command = client.commands.get(interaction.commandName);
            command?.ExecuteCommand(interaction, client);
        }
    })
}