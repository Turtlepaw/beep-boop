/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, Events, MessageReaction, User } from "discord.js";
import Event from "../lib/Event";

export default class TicketService extends Event {
    constructor() {
        super({
            EventName: Events.MessageReactionAdd
        });
    }

    async ExecuteEvent(client: Client, Reaction: MessageReaction, user: User) {
        // 1. Check if the guild has the feature enabled
        // 2. Send a starboard message
    }
}