import { ActionRow, ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, EmbedBuilder, OAuth2Scopes, PermissionFlagsBits, SelectMenuOptionBuilder, SlashCommandStringOption, StringSelectMenuBuilder } from "discord.js";
import SlashCommandBuilder, { Categories } from "../lib/CommandBuilder";
import { Embed, SupportServerInvite } from "../configuration";
import { FormatCommandName } from "../utils/text";
import ContextMenuBuilder from "../lib/ContextMenuBuilder";
import { CommandBuilderType } from "../lib/Builder";
import { Pages } from "../utils/Pages";
import { Filter } from "../utils/filter";

export default class Help extends SlashCommandBuilder {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get some information about Beep Boop.",
            GuildOnly: false,
            Name: "help",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Other,
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
        enum Ids {
            Categories = "CategorySelectMenu"
        }
        const CommandId = interaction.options.getString("command", false);
        const CategoryDescriptions = {
            Server: "Server configuration, moderation, other server-related commands.",
            Images: "Add a shine to your profile picture!",
            Information: "Get information on users and the server.",
            Profiles: "View a user's profile and customize your own.",
            Activites: "Fun games to play and message ranking.",
            Other: "Other stuff that's not in a category."
        }
        const Buttons = new ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(Ids.Categories)
                    .setPlaceholder("Select a category")
                    .setOptions(
                        Object.entries(Categories).map(e =>
                            new SelectMenuOptionBuilder()
                                .setValue(e[0])
                                .setLabel(e[1])
                                .setDescription(CategoryDescriptions[e[0]])
                        )
                    )
                /**/
            );
        const Links = new ActionRowBuilder<ButtonBuilder>()
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
                    .setURL(SupportServerInvite)
                    .setLabel("Discord Server")
            )

        //@ts-expect-error
        let CategoryPages: {
            Server: Pages;
            Images: Pages;
            Information: Pages;
            Profiles: Pages;
            Activites: Pages;
            Other: Pages;
        } = {};

        const DefaultEmbed = new Embed(interaction.guild)
            .setAuthor({
                name: "Beep Boop",
                iconURL: client.user?.avatarURL() || ""
            })
            .setDescription("Here's some basic information about Beep Boop.");
        const MessageEmbed = new EmbedBuilder(DefaultEmbed.data);
        if (CommandId == null) {
            const AllCommands = client.DetailedCommands.map(APICommand => {
                const SlashCommand = client.commands.get(APICommand.Name);
                return {
                    Id: APICommand.Id,
                    FormattedName: FormatCommandName(APICommand.Name),
                    Name: APICommand.Name,
                    Description: SlashCommand?.Description || "This command has no description.",
                    Category: SlashCommand?.Category || Categories.Other,
                    toString: () => `</${APICommand.Name}:${APICommand.Id}>`
                }
            });

            for (const Category of Object.entries(Categories)) {
                const Commands = AllCommands.filter(e => e.Category == Category[1])
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

                CategoryPages[Category[0]] = new Pages()
                    .setEmbeds(PageEmbeds)
                    .setComponents([
                        new ActionRowBuilder()
                            .addComponents(
                                Buttons.components
                            ),
                        Links
                    ]);
            }

            const Message = await interaction.reply({
                embeds: [MessageEmbed],
                components: [Buttons, Links]
            })

            const collect = Message.createMessageComponentCollector({
                time: 0,
                filter: Filter({
                    member: interaction.member,
                    customIds: Ids
                }),
                componentType: ComponentType.StringSelect
            });

            collect.on("collect", async (i) => {
                (CategoryPages[i.values[0]] as Pages).send(i, {
                    disableCustomButtons: false
                });
            });
        } else {
            const APICommand = client.DetailedCommands.find(e => e.Id == CommandId)
            const SlashCommand = client.commands.get(APICommand.Name);
            const ContextMenu = client.ContextMenus.get(APICommand.Name)
            const Command: (SlashCommandBuilder | ContextMenuBuilder) = (SlashCommand || ContextMenu);

            interaction.reply({
                components: [Buttons],
                embeds: [
                    new Embed(interaction.guild)
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