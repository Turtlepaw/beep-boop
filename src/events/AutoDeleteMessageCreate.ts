import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message, MessageType } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";

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
        const Channels: AutoDelete = client.Storage.Get(`${message.guild.id}_auto_deleting`);
        if (Channels == null || Channels?.Channels == null) return;
        if (!Channels.Channels.includes(message.channel.id)) return;
        //if (message.author.bot) return;
        client.Storage.Create(`${message.author.id}_${message.guild.id}_auto_delete`, [
            ...client.Storage.GetArray(`${message.author.id}_${message.guild.id}_auto_delete`), {
                MessageId: message.id,
                ChannelId: message.channel.id
            }]);
    }
}