import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message as GuildMessage, TextChannel } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";

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
        const Channels: string[] = client.Storage.Get(`${member.guild.id}_auto_deleting`);
        if (Channels == null) return;
        const AutoDeleteMessages: MemberMessage[] = await client.Storage.Get(`${member.id}_${member.guild.id}_auto_delete`);

        if (!Array.isArray(AutoDeleteMessages)) return client.Errors.AddError(`Setting configured improperly`, `Auto Delete Message Remove`, member.guild);
        for (const AutoMessage of AutoDeleteMessages) {
            const Channel = await member.guild.channels.fetch(AutoMessage.ChannelId) as TextChannel;

            try {
                const Message = await Channel.messages.fetch(AutoMessage.MessageId);

                if (Message.deletable) Message.delete();
            } catch (e) {

            }
        }

        client.Storage.Delete(`${member.id}_${member.guild.id}_auto_delete`);
    }
}