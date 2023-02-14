import { Client, Events, Message as GuildMessage } from "discord.js";
import Event from "../lib/Event";

export default class TicketMessageDelete extends Event {
    constructor() {
        super({
            EventName: Events.MessageDelete
        });
    }

    async ExecuteEvent(client: Client, Message: GuildMessage) {
        const Ticket = await client.Storage.Tickets.Get({
            ChannelId: Message.channel.id
        });

        if (Ticket == null) return;

        const old = Ticket.Messages.get(Message.id);
        Ticket.Messages.delete(Message.id);
        Ticket.Messages.set(Message.id, {
            Deleted: true,
            ...old
        });

        await client.Storage.Tickets.Edit(Ticket.Entity, {
            Messages: Ticket.Messages
        });
    }
}