import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, CommandInteraction } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed } from "../configuration";

export default class Help extends Command {
    constructor() {
        super({
            CanaryCommand: false,
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
                    .setDescription("Here's some basic information about Beep Boop.\n\nBeep Boop's just an ordinary bot that I built for utility purposes. Here's what you can do with it:")
                    .addFields([{
                        name: `</whats_new:1030653979643887646>`,
                        value: "Shows you what's been happening on Discord, like new changes (e.g. modals, threads, etc...)"
                    }, {
                        name: "You've reached the end...",
                        value: "We're still building stuff!"
                    }])
            ],
            components: [Buttons]
        })
    }
}