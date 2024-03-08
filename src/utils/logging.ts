/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Channel,
  Client,
  Collection,
  ComponentType,
  Events,
  GuildBasedChannel,
  GuildScheduledEvent,
  GuildTextBasedChannel,
  Invite,
  Message,
  MessageActionRowComponent,
  Presence,
  Role,
  Snowflake,
  TimestampStyles,
  User,
  bold,
  codeBlock,
  time,
} from "discord.js";
import { ConfigurationEvents, GuildEvents } from "../@types/Logging";
import { Embed } from "./EmbedBuilder";
import { Logger } from "@logger";
import { Icons } from "@icons";
import e from "express";

export type LogEvents = {
  [key in ConfigurationEvents]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (
      embed: Embed,
      ...args: any
    ) =>
      | string
      | Embed
      | {
          toString: () => Embed;
        };
  };
};

const d = {
  mention: (user: User) => `${user.toString()} (${user.id})`,
  //@ts-expect-error aaa
  channel: (channel: Channel) =>
    `${channel.toString()}${
      typeof channel?.name == "string" ? ` (${channel.name})` : ""
    }`,
  ot: Icons.Dot,
  move: "➜",
};

enum Presets {
  Move = "move",
}

enum ChangeModes {
  Edit = "edit",
  Create = "create",
}

class ChangeManager<T> {
  private changes: Map<
    keyof T,
    {
      value: string;
      override?: string;
    }
  > = new Map();
  private newObject: T;
  private oldObject: T;
  private mode: ChangeModes;
  private embed: Embed;

  constructor(
    embed: Embed,
    newObj: T,
    oldObj: T,
    mode: ChangeModes = ChangeModes.Edit
  ) {
    this.newObject = newObj;
    this.oldObject = oldObj;
    this.mode = mode;
    this.embed = embed;
  }

  private titleCase(str: string): string {
    const words = str.split(/(?=[A-Z])/);
    const formatted = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formatted;
  }

  add(key: keyof T, value: string | Presets, override?: string) {
    if (value == "move")
      value =
        this.mode == ChangeModes.Edit
          ? `${this.oldObject[key]} ${d.move} ${this.newObject[key]}`
          : `${this.newObject[key]}`;
    this.changes.set(key, {
      value,
      override,
    });
    return this;
  }

  addMultiple(keys: (keyof T)[], preset: Presets, override?: string) {
    keys.forEach((key) => this.add(key, preset, override));
    return this;
  }

  toString() {
    let text = "";
    for (const [k, v] of this.changes.entries()) {
      if (
        this.newObject[k] == this.oldObject[k] &&
        this.mode == ChangeModes.Edit
      )
        continue;
      else if (this.newObject[k] == null) continue;
      //else if (k.toString().includes("hex") && this.newObject[k] == "#000000") continue;
      else
        text +=
          `${d.ot} ${(v.override ?? this.titleCase(k as string)) + ":"} ` +
          v.value +
          "\n";
    }

    return this.embed.setDescription(text);
  }
}

function stringToDiff(str: string, type: "-" | "+") {
  return str
    .split("\n")
    .map((e) => type + ` ${e}`)
    .join("\n");
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
    presenceUpdate: (
      ebd: Embed,
      oldPresence: Presence,
      newPresence: Presence
    ) => {
      ebd.setTitle("Member Status Updated");
      // catch updates
      return ebd;
    },
  },
  [ConfigurationEvents.user]: {
    // userUpdate: "User Updated",
  },
  [ConfigurationEvents.guildUpdate]: {
    // guildUpdate: "Server Updated",
  },
  [ConfigurationEvents.invite]: {
    inviteCreate: (ebd, invite: Invite) =>
      `${d.mention(invite.inviter)} created in invite in ${d.channel(
        invite.channel
      )} that expires ${
        invite.expiresTimestamp == null
          ? "never"
          : time(invite.expiresAt, TimestampStyles.RelativeTime)
      }`,
    inviteDelete: (ebd, invite: Invite) =>
      `An invite was deleted in ${d.channel(invite.channel)}`,
  },
  [ConfigurationEvents.messageUpdate]: {
    messageDelete: (ebd, message: Message) =>
      `A message was deleted in ${d.channel(
        message.channel
      )}, this message was authored by ${d.mention(
        message.author
      )}\n${codeBlock(message.content)}`,
    messageDeleteBulk: (
      ebd,
      messages: Collection<Snowflake, Message>,
      channel: GuildBasedChannel
    ) => `${messages.size} messages were mass deleted in ${d.channel(channel)}`,
    messageUpdate: (ebd, oldMessage: Message, newMessage: Message) => {
      ebd.setDescription(
        `${d.mention(newMessage.author)} updated their message in ${d.channel(
          newMessage.channel
        )}`
      );

      if (newMessage.components != oldMessage.components) {
        const Added = [];
        const Removed = [];
        const StillThere = [];
        const AllComponents = [] as MessageActionRowComponent[];
        const OldAllComponents = [] as MessageActionRowComponent[];
        newMessage.components.map((e) => AllComponents.push(...e.components));
        oldMessage.components.map((e) =>
          OldAllComponents.push(...e.components)
        );
        ebd.addFields([
          {
            name: "Components",
            value: codeBlock("diff", `old component\n+ new component`),
          },
        ]);
      }

      if (newMessage.content != oldMessage.content) {
        ebd.addFields([
          {
            name: "Message Content",
            value: codeBlock(
              "diff",
              `${stringToDiff(oldMessage.content, "-")}\n\n${stringToDiff(
                newMessage.content,
                "+"
              )}`
            ),
          },
        ]);
      }

      return ebd;
    },
  },
  [ConfigurationEvents.messageReaction]: {
    // messageReactionRemoveAll: "All Message Reactions Removed",
    // messageReactionRemoveEmoji: "Message Reaction Removed",
    // messageReactionAdd: "Message Reaction Added",
    // messageReactionRemove: "Message Reaction Removed",
  },
  [ConfigurationEvents.role]: {
    roleCreate: (ebd, role: Role) =>
      new ChangeManager(ebd, role, role, ChangeModes.Create).addMultiple(
        ["name", "hexColor", "hoist", "mentionable", "unicodeEmoji"],
        Presets.Move
      ),
    roleDelete: (ebd, role: Role) =>
      `${bold(role.name)} has been deleted ${time(
        new Date(),
        TimestampStyles.RelativeTime
      )}`,
    roleUpdate: (ebd, oldRole: Role, newRole: Role) =>
      new ChangeManager(ebd, newRole, oldRole).addMultiple(
        ["hexColor", "hoist", "mentionable", "name", "unicodeEmoji"],
        Presets.Move
      ),
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
    guildScheduledEventCreate: (embed, event: GuildScheduledEvent) =>
      `${event.creator} (${event.creatorId}) created an event starting ${time(
        event.scheduledStartAt,
        TimestampStyles.RelativeTime
      )} until ${time(event.scheduledEndAt, TimestampStyles.LongDate)} titled ${
        event.name
      }`,
    // guildScheduledEventUpdate: "Event Updated",
    // guildScheduledEventDelete: "Event Deleted",
    // guildScheduledEventUserAdd: "Event User Added",
    // guildScheduledEventUserRemove: "Event User Removed"
  },
} satisfies LogEvents;

export async function LoggingService(client: Client) {
  console.log(`✓ `.green + `Logs ready`.gray);
  const guilds = await client.guilds.fetch();
  guilds.forEach(async (oauthGuild) => {
    const guild = await client.guilds.fetch(oauthGuild.id);
    const config = await client.Storage.Configuration.forGuild(guild);
    if (config.Logging.Status == false || config.Logging.Categories.size == 0)
      return;
    const Channel = (await guild.channels.fetch(
      config.Logging.Channel
    )) as GuildTextBasedChannel;
    Object.entries(ConfigurationEvents)
      .filter((v) => config.Logging.Categories.has(v[1]))
      .forEach((v) => {
        const events = GuildEvents[v[1]];
        Object.entries(events).forEach(([eventName, title]) => {
          client.on(eventName, async (...args) => {
            if (
              eventName == Events.MessageUpdate &&
              args[0]?.author?.id == client.user.id
            )
              return;
            if (args.find((e) => e?.guild?.id != guild.id) != null) return;
            const handler = Handlers[v[1]][eventName];
            try {
              let embed = new Embed(guild).setTitle(title);
              const result = await handler(embed, ...args);
              if (typeof result == "string") embed.setDescription(result);
              if (handler?.toString != null) result.toString();
              if (typeof result == "object") embed = result;
              await Channel.send({
                embeds: [embed],
              });
            } catch (e) {
              Logger.error(`Couldn't log event (${eventName}): ${e}`);
            }
          });
        });
      });
  });
}
