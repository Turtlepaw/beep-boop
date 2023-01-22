/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Client, ClientEvents, Events } from "discord.js";

export type EventBuilderOptions = {
    /**
     * The event to listen for.
     */
    EventName: keyof ClientEvents;
}

export default class Event {
    public EventName: keyof ClientEvents;

    constructor(options: EventBuilderOptions) {
        //Set EventName
        this.EventName = options.EventName
    }

    async ExecuteEvent(
        client: Client,
        ...eventValues: any[]
    ): Promise<void> { }
}