import { ChatInputCommandInteraction } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
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

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        await Verification({
            interaction
        });
    }
}