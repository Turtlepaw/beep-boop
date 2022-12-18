import { SharedSlashCommandOptions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandOptionsOnlyBuilder, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, Client, CommandInteraction, PermissionResolvable, PermissionsString, SlashCommandUserOption } from "discord.js";
import { BuilderOptions, CommandBuilderType } from "./Builder";

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

export interface CommandBuilderOptions {
    /**
     * Required permissions to execute this command.
     */
    RequiredPermissions: PermissionResolvable[];
    /**
     * The member executing this command must have one or more of these permissions.
     */
    SomePermissions: PermissionResolvable[];
    /**
     * If the command can only be executed within a server.
     */
    GuildOnly: boolean;
    /**
     * If this command can only be executed on the development server.
     */
    CanaryCommand: boolean;
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
    Subcomamnds?: (SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder)[];
    Options?: (SlashCommandOption | SlashCommandUserOption)[];
    Category: Categories;
}

export default class Command {
    public Name: string;
    public Description: string;
    public RequiredPermissions!: PermissionResolvable[];
    public SomePermissions!: PermissionResolvable[];
    public Builder: SlashCommandBuilder = new SlashCommandBuilder();
    public CanaryCommand: boolean = false;
    public GuildOnly: boolean = true;
    public Options: SharedSlashCommandOptions;
    public BuilderType: CommandBuilderType;
    public Category: Categories;

    constructor(options: CommandBuilderOptions) {
        //Setting Permissions
        this.SomePermissions = options.SomePermissions;
        this.RequiredPermissions = options.RequiredPermissions;
        //Setting Main Data (name, description, etc...)
        this.Name = options.Name;
        this.Description = options.Description;
        this.CanaryCommand = options.CanaryCommand;
        this.GuildOnly = options.GuildOnly;
        this.BuilderType = CommandBuilderType.ChatInput;
        this.Category = options.Category
        //Set stuff on the builder
        this.Builder
            .setName(this.Name)
            .setDescription(this.Description)
            .setDMPermission(this.GuildOnly)

        if (options?.Options != null) options.Options.forEach(ob => {
            const type = `add${ApplicationCommandOptionType[ob.type]}Option`
            this.Builder[type](e => ob);
        })

        if (options?.Subcomamnds != null) options?.Subcomamnds.forEach(input => {
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
    ): Promise<any> { }

    public async ExecuteAutocompleteRequest(
        interaction: AutocompleteInteraction,
        client: Client
    ): Promise<any> { }
}