import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, ButtonInteraction, Client, CommandInteraction, PermissionsString } from "discord.js";

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
    CustomId: string;
    RequireIdFetching?: boolean;
}
export default class Button {
    public CustomId: string;
    public RequiredPermissions!: PermissionsString[];
    public SomePermissions!: PermissionsString[];
    public GuildOnly: boolean = true;
    public RequireIdFetching: boolean = false;

    constructor(options: ButtonBuilderOptions) {
        //Setting Permissions
        this.SomePermissions = options.SomePermissions;
        this.RequiredPermissions = options.RequiredPermissions;
        //Setting Main Data (customId, guildOnly, etc...)
        this.GuildOnly = options.GuildOnly;
        this.CustomId = options.CustomId;
        this.RequireIdFetching = options.RequireIdFetching;
    }

    async ExecuteInteraction(
        interaction: ButtonInteraction,
        client: Client,
        customId: string
    ): Promise<void> { }
}