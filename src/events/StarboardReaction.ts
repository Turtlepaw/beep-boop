import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message as GuildMessage, MessageReaction, User } from "discord.js";
import { Emojis } from "../configuration";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { Verifiers } from "../utils/verify";
import { Ticket } from "../buttons/CreateTicket";

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