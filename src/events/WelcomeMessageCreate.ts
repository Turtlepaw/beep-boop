import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message, MessageType } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";

export default class LeaveAppealMessage extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, message: Message) {
        if (message.guild?.id == null) return; //dm
        const Server: ServerSettings = client.Storage.Get(`${message.guild.id}_server_settings`);
        if (Server == null || Server?.WelcomeDelete == null || Server.WelcomeDelete == false)
            return;
        if (message.type != MessageType.UserJoin) return;
        client.Storage.Create(`${message.guild.id}_add_${message.author.id}`, {
            MessageId: message.id,
            ChannelId: message.channel.id
        });
    }
}