import { ChatInputCommandInteraction, Client } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed } from "../configuration";
import { FriendlyInteractionError } from "../utils/error";
import { ServerSettings } from "../buttons/ServerSettings";

export default class Activities extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get your rank or another member's rank.",
            GuildOnly: false,
            Name: "rank",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Activites
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        const Level = await client.Levels.Level(interaction.user.id, interaction.guild.id);
        const Settings: ServerSettings = client.storage[`${interaction.guild.id}_server_settings`]
        if (Settings?.Levels == null || Settings?.Levels == false)
            return FriendlyInteractionError(interaction, "Levels haven't been configured in this community yet.")

        await interaction.reply({
            embeds: [
                new Embed(interaction.guild)
                    .setTitle("Rank")
                    .addFields([{
                        name: "Current Level",
                        value: Level.Level.toString()
                    }, {
                        name: "Current XP",
                        value: `${Level.XP.toString()}/100`
                    }])
            ],
            ephemeral: true
        });
    }
}