import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, ButtonInteraction, Client, CommandInteraction, PermissionResolvable, PermissionsString } from "discord.js";
import { Builder, BuilderOptions } from "./Builder";

export interface ButtonBuilderOptions extends BuilderOptions {
    /**
     * The custom Id that was set for this button.
     */
    CustomId: string;
    /**
     * If the handler needs to get the `{any}` Id provided in the button Id. (e.g. `button-{any}`)
     */
    RequireIdFetching?: boolean;
}

export default class Button extends Builder {
    public CustomId: string;
    public RequireIdFetching: boolean = false;

    constructor(options: ButtonBuilderOptions) {
        super(options);
        //Setting Main Data (customId, guildOnly, etc...)
        this.CustomId = options.CustomId;
        this.RequireIdFetching = options.RequireIdFetching;
    }

    async ExecuteInteraction(
        interaction: ButtonInteraction,
        client: Client,
        customId: string
    ): Promise<void> { }
}