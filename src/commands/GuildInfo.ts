import { ChatInputCommandInteraction, SlashCommandBooleanOption } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { GuildInformation } from "../utils/info";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information.",
            GuildOnly: false,
            Name: "server-info",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Information,
            Options: [
                new SlashCommandBooleanOption()
                    .setName("hidden")
                    .setDescription("Make the reply visible only to you and hidden to everyone else.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        await GuildInformation(
            interaction,
            interaction.guild,
            interaction.options.getBoolean("hidden") || false
        );
    }
}