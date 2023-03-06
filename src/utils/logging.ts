import { Channel, Client, Collection, Events, GuildBasedChannel, GuildScheduledEvent, GuildTextBasedChannel, Invite, Message, Role, Snowflake, TimestampStyles, User, bold, codeBlock, time } from "discord.js";
import { ConfigurationEvents, GuildEvents } from "../@types/Logging";
import { Embed } from "./EmbedBuilder";
import { Logger } from "@logger";
import { Icons } from "@icons";

export type LogEvents = {
    [key in ConfigurationEvents]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: (...args: any) => {
            toString: () => string;
        };
    };
};

const d = {
    mention: (user: User) => `${user.toString()} (${user.id})`,
    //@ts-expect-error aaa
    channel: (channel: Channel) => `${channel.toString()}${typeof channel?.name == "string" ? ` (${channel.name})` : ""}`,
    ot: Icons.Dot,
    move: "➜"
}

enum Presets {
    Move = "move"
}

enum ChangeModes {
    Edit = "edit",
    Create = "create"
}

class ChangeManager<T> {
    private changes: Map<keyof T, {
        value: string;
        override?: string;
    }> = new Map();
    private newObject: T;
    private oldObject: T;
    private mode: ChangeModes;

    constructor(newObj: T, oldObj: T, mode: ChangeModes = ChangeModes.Edit) {
        this.newObject = newObj;
        this.oldObject = oldObj;
        this.mode = mode;
    }

    private titleCase(str: string): string {
        const words = str.split(/(?=[A-Z])/);
        const formatted = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return formatted;
    }

    add(key: keyof T, value: string | Presets, override?: string) {
        if (value == "move") value = (this.mode == ChangeModes.Edit ? `${this.oldObject[key]} ${d.move} ${this.newObject[key]}` : `${this.newObject[key]}`);
        this.changes.set(key, {
            value,
            override
        });
        return this;
    }

    addMultiple(keys: (keyof T)[], preset: Presets, override?: string) {
        keys.forEach(key => this.add(key, preset, override))
        return this;
    }

    toString() {
        let text = "";
        for (const [k, v] of this.changes.entries()) {
            if ((this.newObject[k] == this.oldObject[k]) && this.mode == ChangeModes.Edit) continue;
            else if (this.newObject[k] == null) continue;
            //else if (k.toString().includes("hex") && this.newObject[k] == "#000000") continue;
            else text += `${d.ot} ${(v.override ?? this.titleCase(k as string)) + ":"} ` + v.value + "\n";
        }

        return text;
    }
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
        inviteCreate: (invite: Invite) => `${d.mention(invite.inviter)} created in invite in ${d.channel(invite.channel)} that expires ${invite.expiresTimestamp == null ? "never" : time(invite.expiresAt, TimestampStyles.RelativeTime)}`,
        inviteDelete: (invite: Invite) => `An invite was deleted in ${d.channel(invite.channel)}`,
    },
    [ConfigurationEvents.messageUpdate]: {
        messageDelete: (message: Message) => `${d.mention(message.author)} deleted a message in ${d.channel(message.channel)}\n${codeBlock(message.content)}`,
        messageDeleteBulk: (messages: Collection<Snowflake, Message>, channel: GuildBasedChannel) => `${messages.size} messages were mass deleted in ${d.channel(channel)}`,
        messageUpdate: (oldMessage: Message, newMessage: Message) => `${d.mention(newMessage.author)} updated their message in ${d.channel(newMessage.channel)}\n${codeBlock("diff", `- ${oldMessage.content}\n+ ${newMessage.content}`)}`,
    },
    [ConfigurationEvents.messageReaction]: {
        // messageReactionRemoveAll: "All Message Reactions Removed",
        // messageReactionRemoveEmoji: "Message Reaction Removed",
        // messageReactionAdd: "Message Reaction Added",
        // messageReactionRemove: "Message Reaction Removed",
    },
    [ConfigurationEvents.role]: {
        roleCreate: (role: Role) => new ChangeManager(role, role, ChangeModes.Create)
            .addMultiple([
                "name",
                "hexColor",
                "hoist",
                "mentionable",
                "unicodeEmoji"
            ], Presets.Move),
        roleDelete: (role: Role) => `${bold(role.name)} has been deleted ${time(new Date(), TimestampStyles.RelativeTime)}`,
        roleUpdate: (oldRole: Role, newRole: Role) => new ChangeManager(newRole, oldRole)
            .addMultiple([
                "hexColor",
                "hoist",
                "mentionable",
                "name",
                "unicodeEmoji"
            ], Presets.Move)
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
    console.log(`✓ `.green + `Logs ready`.gray)
    const guilds = await client.guilds.fetch();
    guilds.forEach(async oauthGuild => {
        const guild = await client.guilds.fetch(oauthGuild.id);
        const config = await client.Storage.Configuration.forGuild(guild);
        if (config.Logging.Status == false || config.Logging.Categories.size == 0) return;
        const Channel = await guild.channels.fetch(config.Logging.Channel) as GuildTextBasedChannel;
        Object.entries(ConfigurationEvents).filter(v => config.Logging.Categories.has(v[1])).forEach(v => {
            const events = GuildEvents[v[1]];
            Object.entries(events).forEach(([eventName, title]) => {
                client.on(eventName, async (...args) => {
                    if (eventName == Events.MessageUpdate && args[0]?.author?.id == client.user.id) return;
                    const handler = Handlers[v[1]][eventName];
                    try {
                        await Channel.send({
                            embeds: [
                                new Embed(guild)
                                    .setTitle(title)
                                    .setDescription(handler(...args).toString())
                            ]
                        });
                    } catch (e) {
                        Logger.error(`Couldn't log event (${eventName}): ${e}`)
                    }
                });
            });
        });
    });
}