import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, Colors, CommandInteraction, GuildMember, PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed } from "../configuration";
import { MultiplayerRockPaperScissors, RockPaperScissors } from "@airdot/activities";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { ServerSettings } from "src/buttons/ServerSettings";

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
                new Embed()
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