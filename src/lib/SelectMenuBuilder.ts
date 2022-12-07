import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AnySelectMenuInteraction, AutocompleteInteraction, ButtonInteraction, Client, CommandInteraction, PermissionsString } from "discord.js";

export type ButtonBuilderOptions = {
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
     * The custom Id that was set for this button.
     */
    Value: string;
}

export default class SelectOptionBuilder {
    public Value: string;
    public RequiredPermissions!: PermissionsString[];
    public SomePermissions!: PermissionsString[];
    public GuildOnly: boolean = true;

    constructor(options: ButtonBuilderOptions) {
        //Setting Permissions
        this.SomePermissions = options.SomePermissions;
        this.RequiredPermissions = options.RequiredPermissions;
        //Setting Main Data (value, guildOnly, etc...)
        this.GuildOnly = options.GuildOnly;
        this.Value = options.Value;
    }

    async ExecuteInteraction(
        interaction: AnySelectMenuInteraction,
        client: Client,
        value: string[]
    ): Promise<any> { }
}