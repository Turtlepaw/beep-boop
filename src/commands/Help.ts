import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, CommandInteraction } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed } from "../configuration";

export default class Help extends Command {
    constructor() {
        super({
            CanaryCommand: true,
            Description: "Get some information about Beep Boop.",
            GuildOnly: false,
            Name: "help",
            RequiredPermissions: [],
            SomePermissions: []
        });
    }

    async ExecuteCommand(interaction: CommandInteraction, client: Client) {
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.gg/G59JT7VbxZ")
                    .setLabel("Development Server"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://trtle.xyz/")
                    .setLabel("Who built this?")
            );

        await interaction.reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: "Beep Boop",
                        iconURL: client.user?.avatarURL() || ""
                    })
                    .setDescription("Here's some basic information about Beep Boop.")
                    .addFields([
                        {
                            name: "Who built this?",
                            value: "Turtlepaw#3806"
                        },
                        {
                            name: "What's this bot for?",
                            value: "Mainly utilies for my servers"
                        }
                    ])
            ],
            components: [Buttons]
        })
    }
}