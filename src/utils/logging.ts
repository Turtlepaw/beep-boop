import { Channel, Client, Collection, GuildBasedChannel, GuildScheduledEvent, GuildTextBasedChannel, Message, Snowflake, TimestampStyles, User, codeBlock, time } from "discord.js";
import { ConfigurationEvents, GuildEvents } from "../@types/Logging";
import { Embed } from "./EmbedBuilder";

export type LogEvents = {
    [key in ConfigurationEvents]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: (...args: any) => string;
    };
};

const d = {
    mention: (user: User) => `${user.toString()} (${user.id})`,
    //@ts-expect-error aaa
    channel: (channel: Channel) => `${channel.toString()}${typeof channel?.name == "string" ? ` (${channel.name})` : ""}`,

}

const Handlers = {
    [ConfigurationEvents.autoModeration]: {
        // autoModerationActionExecution: "Auto Moderation Action Executed",
        // autoModerationRuleCreate: "Auto Moderation Rule Created",
        // autoModerationRuleDelete: "Auto Moderation Rule Deleted",
        // autoModerationRuleUpdate: "Auto Moderation Rule Updated",
    },
    [ConfigurationEvents.channel]: {
        // channelCreate: "Channel Created",
        // channelDelete: "Channel Deleted",
        // channelUpdate: "Channel Updated",
    },
    [ConfigurationEvents.pins]: {
        // channelPinsUpdate: "Channel Pins",
    },
    [ConfigurationEvents.emoji]: {
        // emojiCreate: "Emoji Created",
        // emojiDelete: "Emoji Deleted",
        // emojiUpdate: "Emoji Updated",
    },
    [ConfigurationEvents.guildBan]: {
        // guildBanAdd: "Member Banned",
        // guildBanRemove: "Member Unbanned",
    },
    [ConfigurationEvents.guildIntegrations]: {
        // guildIntegrationsUpdate: "Integration Added",
    },
    [ConfigurationEvents.guildMemberInvites]: {
        // guildMemberAdd: "Member Joined",
        // guildMemberRemove: "Member Left"
    },
    [ConfigurationEvents.guildMember]: {
        // guildMemberUpdate: "Member Profile Edited",
        // presenceUpdate: "Member Status Updated",
    },
    [ConfigurationEvents.user]: {
        // userUpdate: "User Updated",
    },
    [ConfigurationEvents.guildUpdate]: {
        // guildUpdate: "Server Updated",
    },
    [ConfigurationEvents.invite]: {
        // inviteCreate: "Invite Created",
        // inviteDelete: "Invite Deleted",
    },
    [ConfigurationEvents.messageUpdate]: {
        messageDelete: (message: Message) => `${d.mention(message.author)} deleted a message in ${d.channel(message.channel)}\n${codeBlock(message.content)}`,
        messageDeleteBulk: (messages: Collection<Snowflake, Message>, channel: GuildBasedChannel) => `${d.mention(messages.)}`,
        // messageUpdate: "Message Edited",
    },
    [ConfigurationEvents.messageReaction]: {
        // messageReactionRemoveAll: "All Message Reactions Removed",
        // messageReactionRemoveEmoji: "Message Reaction Removed",
        // messageReactionAdd: "Message Reaction Added",
        // messageReactionRemove: "Message Reaction Removed",
    },
    [ConfigurationEvents.role]: {
        // roleCreate: "Role Created",
        // roleDelete: "Role Removed",
        // roleUpdate: "Role Updated",
    },
    [ConfigurationEvents.thread]: {
        // threadCreate: "Thread Created",
        // threadDelete: "Thread Deleted",
        // threadListSync: "Thread List Synced",
        // threadMemberUpdate: "Thread Member Updated",
        // threadMembersUpdate: "Thread Members Updated",
        // threadUpdate: "Thread Updated",
    },
    [ConfigurationEvents.webhook]: {
        // webhookUpdate: "Webhook Updated",
    },
    [ConfigurationEvents.stageInstance]: {
        // stageInstanceCreate: "Stage Channel Created",
        // stageInstanceUpdate: "Stage Channel Updated",
        // stageInstanceDelete: "Stage Channel Deleted",
    },
    [ConfigurationEvents.sticker]: {
        // stickerCreate: "Sticker Created",
        // stickerDelete: "Sticker Deleted",
        // stickerUpdate: "Sticker Updated",
    },
    [ConfigurationEvents.guildScheduledEvent]: {
        guildScheduledEventCreate: (event: GuildScheduledEvent) => `${event.creator} (${event.creatorId}) created an event starting ${time(event.scheduledStartAt, TimestampStyles.RelativeTime)} until ${time(event.scheduledEndAt, TimestampStyles.LongDate)} titled ${event.name}`,
        // guildScheduledEventUpdate: "Event Updated",
        // guildScheduledEventDelete: "Event Deleted",
        // guildScheduledEventUserAdd: "Event User Added",
        // guildScheduledEventUserRemove: "Event User Removed"
    }
} satisfies LogEvents;

export async function LoggingService(client: Client) {
    setTimeout(async () => {
        const guilds = await client.guilds.fetch();
        guilds.forEach(async oauthGuild => {
            const guild = await client.guilds.fetch(oauthGuild.id);
            const config = await client.Storage.Configuration.forGuild(guild);
            if (config.Logging.Status == false || config.Logging.Categories.size == 0) return;
            const Channel = await guild.channels.fetch(config.Logging.Channel) as GuildTextBasedChannel;
            Object.entries(ConfigurationEvents).filter(v => config.Logging.Categories.has(v[1])).forEach(v => {
                const events = GuildEvents[v[1]];
                Object.entries(events).forEach(([eventName, title]) => {
                    client.on(eventName, (args) => {
                        const handler = Handlers[v[1]][eventName];
                        Channel.send({
                            embeds: [
                                new Embed(guild)
                                    .setTitle(title)
                                    .setDescription(handler(args))
                            ]
                        })
                    });
                });
            });
        });
    }, 6000)
}