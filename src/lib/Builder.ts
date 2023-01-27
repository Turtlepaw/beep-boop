import { PermissionResolvable } from "discord.js";

export enum CommandBuilderType {
    ContextMenu = "CONTEXT_MENU",
    ChatInput = "CHAT_INPUT"
}

export interface aBuilderOptions {
    type: CommandBuilderType;
}

export interface BuilderOptions {
    /**
     * Required permissions to execute this command.
     */
    RequiredPermissions?: PermissionResolvable[];
    /**
     * The member executing this command must have one or more of these permissions.
     */
    SomePermissions?: PermissionResolvable[];
    /**
     * If the command can only be executed within a server.
     */
    GuildOnly?: boolean;
    /**
     * If this command can only be executed on the development server.
     */
    CanaryCommand?: boolean;
    /**
     * The required permissions for the bot to run this.
     */
    ClientPermissions?: PermissionResolvable[];
}

export class Builder {
    public RequiredPermissions: PermissionResolvable[];
    public SomePermissions: PermissionResolvable[];
    public CanaryCommand: boolean;
    public GuildOnly: boolean;
    public ClientPermissions: PermissionResolvable[];

    constructor(options: BuilderOptions) {
        this.RequiredPermissions = options.RequiredPermissions ?? [];
        this.SomePermissions = options.SomePermissions ?? [];
        this.ClientPermissions = options.ClientPermissions ?? [];
        this.CanaryCommand = options.CanaryCommand ?? false;
        this.GuildOnly = options.GuildOnly ?? true;
    }
}