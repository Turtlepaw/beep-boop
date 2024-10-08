/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, ContextMenuCommandBuilder, ContextMenuCommandInteraction, ContextMenuCommandType } from "discord.js";
import { Builder, BuilderOptions, CommandBuilderType } from "./Builder";

export interface ContextMenuBuilderOptions extends BuilderOptions {
    /**
     * The name of this command. (e.g. User Information)
     */
    Name: string;
    /**
     * The type of this context menu. (can be user or message)
     */
    Type: ContextMenuCommandType;
}

export default class ContextMenu extends Builder {
    public Name: string;
    public Type: ContextMenuCommandType;
    public Builder: ContextMenuCommandBuilder = new ContextMenuCommandBuilder();
    public BuilderType: CommandBuilderType;

    constructor(options: ContextMenuBuilderOptions) {
        super(options);
        //Setting Main Data (name, guild only, etc...)
        this.Name = options.Name;
        this.Type = options.Type;
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
        // @ts-expect-error this is a builder
    ): Promise<unknown | void> { }
}