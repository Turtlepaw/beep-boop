import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message as GuildMessage, TextChannel } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";
import { CleanupType } from "src/models/Configuration";

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
        const Server = await client.Storage.Configuration.forGuild(member.guild);
        if (Server == null || Server.CleanupType.includes(CleanupType.System))
            return;
        const JoinMessage: MemberMessage = await client.Storage.Messages.Get({
            CustomId: `${member.guild.id}_add_${member.id}`
        });
        const Channel = await member.guild.channels.fetch(JoinMessage.ChannelId) as TextChannel;

        try {
            const Message = await Channel.messages.fetch(JoinMessage.MessageId);

            if (Message.deletable) Message.delete();
        } catch (e) {

        }
    }
}