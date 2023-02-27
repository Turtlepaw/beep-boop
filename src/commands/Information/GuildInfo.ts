import { ChatInputCommandInteraction } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { GuildInformation } from "../../utils/info";
import { CommandOptions } from "@utils/defaults";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information on the current server.",
            GuildOnly: false,
            Name: "server-info",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Information,
            Options: [
                CommandOptions.Hidden()
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