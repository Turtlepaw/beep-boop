import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, Client, CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, ContextMenuCommandType, PermissionResolvable, PermissionsString } from "discord.js";
import { BuilderOptions, CommandBuilderType } from "./Builder";

export interface ContextMenuBuilderOptions {
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
     * The name of this command. (e.g. User Information)
     */
    Name: string;
    /**
     * The type of this context menu. (can be user or message)
     */
    Type: ContextMenuCommandType;
}
export default class ContextMenu {
    public Name: string;
    public Type: ContextMenuCommandType;
    public RequiredPermissions!: PermissionResolvable[];
    public SomePermissions!: PermissionResolvable[];
    public Builder: ContextMenuCommandBuilder = new ContextMenuCommandBuilder();
    public CanaryCommand: boolean = false;
    public GuildOnly: boolean = true;
    public BuilderType: CommandBuilderType;

    constructor(options: ContextMenuBuilderOptions) {
        //Setting Permissions
        this.SomePermissions = options.SomePermissions;
        this.RequiredPermissions = options.RequiredPermissions;
        //Setting Main Data (name, guild only, etc...)
        this.Name = options.Name;
        this.Type = options.Type;
        this.CanaryCommand = options.CanaryCommand;
        this.GuildOnly = options.GuildOnly;
        this.BuilderType = CommandBuilderType.ContextMenu;
        //Set stuff on the builder
        this.Builder
            .setName(this.Name)
            .setType(this.Type)
            .setDMPermission(this.GuildOnly)
    }

    public async ExecuteContextMenu(
        interaction: ContextMenuCommandInteraction,
        client: Client
    ): Promise<void> { }
}