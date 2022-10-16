import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, Client, CommandInteraction, PermissionsString } from "discord.js";

export type CommandBuilderOptions = {
    /**
     * Required permissions to execute this command.
     */
    RequiredPermissions: PermissionsString[];
    /**
     * The member executing this command must have one or more of these permissions.
     */
    SomePermissions: PermissionsString[];
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
}
export default class Command {
    public Name: string;
    public Description: string;
    public RequiredPermissions!: PermissionsString[];
    public SomePermissions!: PermissionsString[];
    public Builder: SlashCommandBuilder = new SlashCommandBuilder();
    public CanaryCommand: boolean = false;
    public GuildOnly: boolean = true;

    constructor(options: CommandBuilderOptions) {
        //Setting Permissions
        this.SomePermissions = options.SomePermissions;
        this.RequiredPermissions = options.RequiredPermissions;
        //Setting Main Data (name, description, etc...)
        this.Name = options.Name;
        this.Description = options.Description;
        this.CanaryCommand = options.CanaryCommand;
        this.GuildOnly = options.GuildOnly;
        //Set stuff on the builder
        this.Builder
            .setName(this.Name)
            .setDescription(this.Description)
            .setDMPermission(this.GuildOnly)
    }

    MakeCommandJSON() {
        return this.Builder.toJSON();
    }

    public async ExecuteCommand(
        interaction: CommandInteraction,
        client: Client
    ): Promise<void> { }

    public async ExecuteAutocompleteRequest(
        interaction: AutocompleteInteraction,
        client: Client
    ): Promise<void> { }
}