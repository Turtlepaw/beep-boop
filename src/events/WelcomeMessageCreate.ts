import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message, MessageType } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";
import { MessageType as StoredMessageType } from "../models/Message";

export default class LeaveAppealMessage extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, message: Message) {
        if (message.guild?.id == null) return; //dm
        const Server = await client.Storage.Configuration.forGuild(message.guild);
        if (Server == null || !Server.isSystemCleanup()) return;
        if (message.type != MessageType.UserJoin) return;
        client.Storage.Messages.Create({
            Message: message.id,
            Channel: message.channel.id,
            CustomName: `${message.guild.id}_add_${message.author.id}`,
            Type: StoredMessageType.SystemMessage,
            Author: message.author.id,
            CreatedAt: message.createdTimestamp,
            Guild: message.guild.id
        });
    }
}