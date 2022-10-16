import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, ButtonInteraction, Client, ClientEvents, CommandInteraction, Events, PermissionsString } from "discord.js";

export type EventBuilderOptions = {
    /**
     * The event to listen for.
     */
    EventName: Events;
}

export default class Event {
    public EventName: Events;

    constructor(options: EventBuilderOptions) {
        //Set EventName
        this.EventName = options.EventName
    }

    async ExecuteEvent(
        client: Client,
        ...eventValues: any[]
    ): Promise<void> { }
}