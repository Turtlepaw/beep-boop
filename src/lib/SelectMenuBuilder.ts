/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnySelectMenuInteraction, Client } from "discord.js";
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
        //@ts-expect-error this is a builder
    ): Promise<unknown> { }
}