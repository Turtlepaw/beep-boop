import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";
import { MessageType } from "../models/Message";

export interface AutoDelete {
    Channels: string;
    AfterTime: string;
}

export default class AutoDeleteMessageCreateEvent extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, message: Message) {
        if (message.guild?.id == null) return; //dm
        const Configuration = await client.Storage.Configuration.forGuild(message.guild);
        const Channels = Configuration.CleanupChannels;
        if (Channels == null) return;
        if (!Channels.includes(message.channel.id)) return;
        //if (message.author.bot) return;
        client.Storage.Messages.Create({
            CustomId: `AUTO_CLEANUP`,
            Type: MessageType.CleanupMessage,
            ChannelId: message.channel.id,
            MessageId: message.id,
            AuthorId: message.author.id
        });
    }
}