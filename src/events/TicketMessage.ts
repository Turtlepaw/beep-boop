import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message as GuildMessage } from "discord.js";
import { Emojis } from "../configuration";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { Verifiers } from "../utils/verify";
import { Ticket } from "../buttons/CreateTicket";

export default class TicketService extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, Message: GuildMessage) {
        const Ticket: Ticket | null = client.storage[`ticket_${Message.channel.id}`];
        if (Ticket != null) {
            const storage = client.storage[`ticket_messages_${Message.channel.id}`];
            client.storage[`ticket_messages_${Message.channel.id}`] = [{
                Id: Message.id,
                Content: Message.content,
                SentAt: Message.createdTimestamp,
                Author: {
                    Name: Message.author.username,
                    Avatar: Message.author.displayAvatarURL()
                }
            },
            ...(storage != null ? storage : [])
            ]
        }
    }
}