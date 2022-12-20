import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message as GuildMessage, TextChannel } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";
import { MessageType } from "../models/Message";

export interface MemberMessage {
    MessageId: string;
    ChannelId: string;
}

export default class LeaveAppealMessage extends Event {
    constructor() {
        super({
            EventName: Events.GuildMemberRemove
        });
    }

    async ExecuteEvent(client: Client, member: GuildMember) {
        const Configuration = await client.Storage.Configuration.forGuild(member.guild);
        const Channels = Configuration.CleanupChannels;
        if (Channels == null) return;
        const AutoDeleteMessages = await client.Storage.Messages.FindBy({
            Author: member.id,
            Type: MessageType.CleanupMessage
        });

        for (const AutoMessage of AutoDeleteMessages) {
            const Channel = await member.guild.channels.fetch(AutoMessage.Channel) as TextChannel;

            try {
                const Message = await Channel.messages.fetch(AutoMessage.Message);

                if (Message.deletable) Message.delete();
            } catch (e) {

            }
        }
    }
}