import { ChatInputCommandInteraction, SlashCommandUserOption } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { MemberInformation } from "../../utils/info";
import { CommandOptions } from "@utils/defaults";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information on a user or yourself.",
            GuildOnly: false,
            Name: "user-info",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Information,
            Options: [
                new SlashCommandUserOption()
                    .setName("member")
                    .setDescription("The member to get information on."),
                CommandOptions.Hidden()
            ]
            /*Subcomamnds: [
                new SlashCommandSubcommandBuilder()
                    .setName("info")
                    .setDescription("Get information on a user in this server.")
                    .addUserOption(e =>
                        e.setName("member")
                            .setDescription("The member to get information on.")
                    )
                    .addBooleanOption(e =>
                        e.setName("hidden")
                            .setDescription("Make the reply visible only to you and hidden to everyone else.")
                    )
            ]*/
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        await MemberInformation(
            interaction,
            interaction.options.getUser("member") || interaction.user,
            interaction.options.getBoolean("hidden") || false
        );
    }
}