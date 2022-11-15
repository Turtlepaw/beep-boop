import { ActionRow, ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, CommandInteraction, EmbedBuilder, OAuth2Scopes, PermissionFlagsBits, SlashCommandStringOption } from "discord.js";
import SlashCommandBuilder from "../lib/CommandBuilder";
import { Embed } from "../configuration";
import { FormatCommandName } from "../utils/text";
import ContextMenuBuilder from "../lib/ContextMenuBuilder";
import { CommandBuilderType } from "../lib/Builder";
import { Pages } from "utilsfordiscordjs";

export default class Help extends SlashCommandBuilder {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get some information about Beep Boop.",
            GuildOnly: false,
            Name: "help",
            RequiredPermissions: [],
            SomePermissions: [],
            Options: [
                new SlashCommandStringOption()
                    .setAutocomplete(true)
                    .setName("command")
                    .setDescription("The name of the command.")
            ]
        });
    }

    async ExecuteAutocompleteRequest(interaction: AutocompleteInteraction, client: Client) {
        const Commands = client.DetailedCommands;
        const Value = interaction.options.getFocused();

        const FilteredCommands = Commands.filter(e => {
            return (
                e.Name.toLowerCase().startsWith(Value.toLowerCase()) ||
                e.Name.toLowerCase().endsWith(Value) ||
                e.Name.toLowerCase().includes(Value)
            )
        }).map(e => ({
            name: FormatCommandName(e.Name),
            value: e.Id
        }));

        interaction.respond([
            ...FilteredCommands
        ])
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        const CommandId = interaction.options.getString("command", false);
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

        if (CommandId == null) {
            const Commands = client.DetailedCommands.map(APICommand => {
                const SlashCommand = client.commands.get(APICommand.Name);
                return {
                    Id: APICommand.Id,
                    FormattedName: FormatCommandName(APICommand.Name),
                    Name: APICommand.Name,
                    Description: SlashCommand?.Description || "This command has no description.",
                    toString: () => `</${APICommand.Name}:${APICommand.Id}>`
                }
            });
            const DefaultEmbed = new Embed()
                .setAuthor({
                    name: "Beep Boop",
                    iconURL: client.user?.avatarURL() || ""
                })
                .setDescription("Here's some basic information about Beep Boop.");

            const PageEmbeds = [];
            const Max = 5;
            let FieldsAdded = 0;
            let At = 0;
            let CurrentEmbed = new EmbedBuilder(DefaultEmbed.data);
            for (const Command of Commands) {
                if (At == Max) {
                    At = 0;
                    PageEmbeds.push(CurrentEmbed)
                    CurrentEmbed = new EmbedBuilder(DefaultEmbed.data);
                    continue;
                }

                CurrentEmbed.addFields([{
                    name: Command.toString(),
                    value: Command.Description
                }]);

                FieldsAdded++

                if (FieldsAdded == (Commands.length - 1)) {
                    PageEmbeds.push(CurrentEmbed);
                }

                At++
            }

            new Pages()
                .setEmbeds(PageEmbeds)
                .setComponents(Buttons.components)
                .send(interaction, {
                    disableCustomButtons: false
                });
        } else {
            const APICommand = client.DetailedCommands.find(e => e.Id == CommandId)
            const SlashCommand = client.commands.get(APICommand.Name);
            const ContextMenu = client.ContextMenus.get(APICommand.Name)
            const Command: (SlashCommandBuilder | ContextMenuBuilder) = (SlashCommand || ContextMenu);

            interaction.reply({
                components: [Buttons],
                embeds: [
                    new Embed()
                        .setAuthor({
                            name: "Beep Boop",
                            iconURL: client.user?.avatarURL() || ""
                        })
                        .setTitle(FormatCommandName(APICommand.Name))
                        .setDescription((Command as SlashCommandBuilder)?.Description || "This command has no description.")
                        .addFields([{
                            name: "Command Information",
                            value: `- ${Command.GuildOnly ? `This command can only be used within a server.` : `This command can be used in DMs.`}\n- ${Command.CanaryCommand ? `This command is still in development.` : `This command is public.`}`
                        }, {
                            name: "Try it out",
                            value: `</${APICommand.Name}:${APICommand.Id}>`
                        }])
                ]
            })
        }
    }
}