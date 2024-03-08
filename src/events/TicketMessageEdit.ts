import {
  Client,
  Events,
  Message as GuildMessage,
  ImageFormat,
} from "discord.js";
import Event from "../lib/Event";

export default class TicketMessageEdit extends Event {
  constructor() {
    super({
      EventName: Events.MessageUpdate,
    });
  }

  async ExecuteEvent(client: Client, _: GuildMessage, Message: GuildMessage) {
    console.log("Edit!", Message.content);
    const Ticket = await client.Storage.Tickets.Get({
      ChannelId: Message.channel.id,
    });

    if (Ticket == null) return;

    Ticket.Messages.delete(Message.id);
    Ticket.Messages.set(Message.id, {
      Content: Message.content,
      Date: Message.createdAt.toString(),
      Embeds: Message.embeds,
      Id: Message.id,
      User: {
        Avatar: Message.author.displayAvatarURL({
          extension: ImageFormat.PNG,
          forceStatic: true,
          size: 4096,
        }),
        Tag: Message.author.globalName,
        Username: Message.author.username,
        Bot: Message.author.bot,
        Id: Message.author.id,
        Color: Message.member.roles.highest.hexColor,
      },
      Components: [],
      Deleted: false,
      isEdit: true,
    });

    await client.Storage.Tickets.Edit(Ticket.Entity, {
      Messages: Ticket.Messages,
    });
  }
}
