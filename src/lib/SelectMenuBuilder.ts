import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AnySelectMenuInteraction, AutocompleteInteraction, ButtonInteraction, Client, CommandInteraction, PermissionFlags, PermissionResolvable, PermissionsString } from "discord.js";
import { Builder, BuilderOptions } from "./Builder";

export interface ButtonBuilderOptions extends BuilderOptions {
    /**
     * The custom Id that was set for this button.
     */
    Value: string;
}

export default class SelectOptionBuilder extends Builder {
    public Value: string;

    constructor(options: ButtonBuilderOptions) {
        super(options);
        this.Value = options.Value;
    }

    async ExecuteInteraction(
        interaction: AnySelectMenuInteraction,
        client: Client,
        value: string[]
    ): Promise<any> { }
}