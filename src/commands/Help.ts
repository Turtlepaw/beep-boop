import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, CommandInteraction, OAuth2Scopes, PermissionFlagsBits } from "discord.js";
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
                    .setURL(client.generateInvite({
                        permissions: [
                            PermissionFlagsBits.Administrator
                        ],
                        scopes: [
                            OAuth2Scopes.Bot,
                            OAuth2Scopes.ApplicationsCommands
                        ]
                    }))
                    .setLabel("Add to Server"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.gg/G59JT7VbxZ")
                    .setLabel("Development Server")
            );

        await interaction.reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: "Beep Boop",
                        iconURL: client.user?.avatarURL() || ""
                    })
                    .setDescription("Here's some basic information about Beep Boop.")
                    .addFields([{
                        name: `</whats_new:1035020379388919871>`,
                        value: "Shows you what's been happening on Discord, like new changes (e.g. modals, threads, etc...)"
                    }, {
                        name: `</server:1035020379388919870>`,
                        value: "Manage the server's settings."
                    }, {
                        name: `</developer:1035020379388919868>`,
                        value: "Built for developers but anyone allowed to use it."
                    }, {
                        name: "You've reached the end...",
                        value: "We're still building stuff!"
                    }])
            ],
            components: [Buttons]
        })
    }
}