export enum ConfigurationEvents {
  autoModeration = "Auto Moderation",
  channel = "Channel",
  pins = "Pinned Messages",
  emoji = "Emojis",
  guildBan = "Member Bans",
  guildIntegrations = "Integrations",
  guildMemberInvites = "Member Join/Leave",
  guildMember = "Member Profile & Status",
  guildUpdate = "Server Updates",
  invite = "Invites",
  messageReaction = "Message Reactions",
  messageUpdate = "Message Edited/Deleted",
  role = "Roles",
  thread = "Threads",
  user = "Users",
  webhook = "Webhooks",
  stageInstance = "Stage Channels",
  sticker = "Stickers",
  guildScheduledEvent = "Server Events",
}

export type GuildEvents = {
  [key in ConfigurationEvents]: {
    [key: string]: string;
  };
};

export const GuildEvents = {
  [ConfigurationEvents.autoModeration]: {
    autoModerationActionExecution: "Auto Moderation Action Executed",
    autoModerationRuleCreate: "Auto Moderation Rule Created",
    autoModerationRuleDelete: "Auto Moderation Rule Deleted",
    autoModerationRuleUpdate: "Auto Moderation Rule Updated",
  },
  [ConfigurationEvents.channel]: {
    channelCreate: "Channel Created",
    channelDelete: "Channel Deleted",
    channelUpdate: "Channel Updated",
  },
  [ConfigurationEvents.pins]: {
    channelPinsUpdate: "Channel Pins",
  },
  [ConfigurationEvents.emoji]: {
    emojiCreate: "Emoji Created",
    emojiDelete: "Emoji Deleted",
    emojiUpdate: "Emoji Updated",
  },
  [ConfigurationEvents.guildBan]: {
    guildBanAdd: "Member Banned",
    guildBanRemove: "Member Unbanned",
  },
  [ConfigurationEvents.guildIntegrations]: {
    guildIntegrationsUpdate: "Integration Added",
  },
  [ConfigurationEvents.guildMemberInvites]: {
    guildMemberAdd: "Member Joined",
    guildMemberRemove: "Member Left",
  },
  [ConfigurationEvents.guildMember]: {
    guildMemberUpdate: "Member Profile Edited",
    presenceUpdate: "Member Status Updated",
  },
  [ConfigurationEvents.user]: {
    userUpdate: "User Updated",
  },
  [ConfigurationEvents.guildUpdate]: {
    guildUpdate: "Server Updated",
  },
  [ConfigurationEvents.invite]: {
    inviteCreate: "Invite Created",
    inviteDelete: "Invite Deleted",
  },
  [ConfigurationEvents.messageUpdate]: {
    messageDelete: "Message Deleted",
    messageDeleteBulk: "Messages Mass Deleted",
    messageUpdate: "Message Edited",
  },
  [ConfigurationEvents.messageReaction]: {
    messageReactionRemoveAll: "All Message Reactions Removed",
    messageReactionRemoveEmoji: "Message Reaction Removed",
    messageReactionAdd: "Message Reaction Added",
    messageReactionRemove: "Message Reaction Removed",
  },
  [ConfigurationEvents.role]: {
    roleCreate: "Role Created",
    roleDelete: "Role Removed",
    roleUpdate: "Role Updated",
  },
  [ConfigurationEvents.thread]: {
    threadCreate: "Thread Created",
    threadDelete: "Thread Deleted",
    threadListSync: "Thread List Synced",
    threadMemberUpdate: "Thread Member Updated",
    threadMembersUpdate: "Thread Members Updated",
    threadUpdate: "Thread Updated",
  },
  [ConfigurationEvents.webhook]: {
    webhookUpdate: "Webhook Updated",
  },
  [ConfigurationEvents.stageInstance]: {
    stageInstanceCreate: "Stage Channel Created",
    stageInstanceUpdate: "Stage Channel Updated",
    stageInstanceDelete: "Stage Channel Deleted",
  },
  [ConfigurationEvents.sticker]: {
    stickerCreate: "Sticker Created",
    stickerDelete: "Sticker Deleted",
    stickerUpdate: "Sticker Updated",
  },
  [ConfigurationEvents.guildScheduledEvent]: {
    guildScheduledEventCreate: "Event Created",
    guildScheduledEventUpdate: "Event Updated",
    guildScheduledEventDelete: "Event Deleted",
    guildScheduledEventUserAdd: "Event User Added",
    guildScheduledEventUserRemove: "Event User Removed",
  },
} satisfies GuildEvents;
