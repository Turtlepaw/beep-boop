import { ChatInputCommandInteraction, SlashCommandRoleOption } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { RoleInformation } from "../../utils/info";
import { CommandOptions } from "@utils/defaults";

export default class Role extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information on a specific role.",
            GuildOnly: false,
            Name: "role-info",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Information,
            Options: [
                new SlashCommandRoleOption()
                    .setName("role")
                    .setDescription("The role to get information on.")
                    .setRequired(true),
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
        await RoleInformation(
            interaction,
            interaction.options.getRole("role"),
            CommandOptions.GetHiden(interaction)
        )
    }
}