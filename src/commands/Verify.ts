import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, CommandInteraction } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed } from "../configuration";
import { Verification } from "../utils/Verification";

export default class Verify extends Command {
    constructor() {
        super({
            CanaryCommand: true,
            Description: "Starts the verification process.",
            GuildOnly: false,
            Name: "verify",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Server
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        await Verification({
            interaction
        });
    }
}