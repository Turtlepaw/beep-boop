/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, Client, SlashCommandUserOption } from "discord.js";
import { Builder, BuilderOptions, CommandBuilderType } from "./Builder";

export type SlashCommandOption = SlashCommandRoleOption |
    SlashCommandAttachmentOption |
    SlashCommandBooleanOption |
    SlashCommandChannelOption |
    SlashCommandIntegerOption |
    SlashCommandMentionableOption |
    SlashCommandNumberOption |
    SlashCommandStringOption;

export enum Categories {
    Server = "Server",
    Images = "Image Generation",
    Information = "Information",
    Profiles = "Profiles (beta)",
    Activites = "Actvities",
    Other = "Other"
}

export interface CommandBuilderOptions extends BuilderOptions {
    /**
     * The name of this command. (e.g. /command)
     */
    Name: string;
    /**
     * The description of the command that will be shown to the member.
     */
    Description: string;
    /**
     * The subcommands for this command.
     */
    Subcommands?: (SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder)[];
    Options?: (SlashCommandOption | SlashCommandUserOption)[];
    Category: Categories;
}

export default class Command extends Builder {
    public Name: string;
    public Description: string;
    public Builder: SlashCommandBuilder = new SlashCommandBuilder();
    public Options: SharedSlashCommandOptions;
    public BuilderType: CommandBuilderType;
    public Category: Categories;

    constructor(options: CommandBuilderOptions) {
        super(options);
        //Setting Main Data (name, description, etc...)
        this.Name = options.Name;
        this.Description = options.Description;
        this.BuilderType = CommandBuilderType.ChatInput;
        this.Category = options.Category;
        //Set stuff on the builder
        this.Builder
            .setName(this.Name)
            .setDescription(this.Description)
            .setDMPermission(this.GuildOnly);

        if (options?.Options != null) options.Options.forEach(ob => {
            const type = `add${ApplicationCommandOptionType[ob.type]}Option`
            this.Builder[type](e => ob);
        })

        if (options?.Subcommands != null) options?.Subcommands.forEach(input => {
            if (input instanceof SlashCommandSubcommandGroupBuilder) {
                return this.Builder.addSubcommandGroup(input)
            } else {
                this.Builder.addSubcommand(input)
            }
        });
    }

    MakeCommandJSON() {
        return this.Builder.toJSON();
    }

    public async ExecuteCommand(
        interaction: ChatInputCommandInteraction,
        client: Client
        //@ts-expect-error
    ): Promise<unknown> { }

    public async ExecuteAutocompleteRequest(
        interaction: AutocompleteInteraction,
        client: Client
        //@ts-expect-error
    ): Promise<unknown> { }
}