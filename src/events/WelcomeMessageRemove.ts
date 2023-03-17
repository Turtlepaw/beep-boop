import { Client, Events, GuildMember, TextChannel } from "discord.js";
import Event from "../lib/Event";
import { CleanupType } from "../models/Configuration";
import { Logger } from "../logger";
import { LogSnagChannels } from "src/@types/logsnag";

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
        if (Server == null || !Array.isArray(Server.CleanupType) || !Server.CleanupType.includes(CleanupType.System))
            return;
        const JoinMessage = await client.Storage.Messages.Get({
            CustomName: `${member.guild.id}_add_${member.id}`
        });
        const Channel = await member.guild.channels.fetch(JoinMessage.Channel) as TextChannel;

        client.LogSnag.publish({
            channel: LogSnagChannels.WelcomeMessages,
            event: "Welcome Message Deleted",
            icon: "🗑️",
            tags: {
                user: member.user.tag
            }
        });

        try {
            const Message = await Channel.messages.fetch(JoinMessage.Message);

            if (Message.deletable) Message.delete();
            else client.Errors.AddError("Couldn't delete welcome message", "Welcome Messages (auto cleanup)", member.guild);
        } catch (e) {
            Logger.error(`Error Deleting Welcome Message: ${e}`);
        }
    }
}