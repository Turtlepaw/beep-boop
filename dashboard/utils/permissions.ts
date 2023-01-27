//import { BitField, PermissionFlagsBits, PermissionsBitField } from "discord.js";
//import BitField from "bitfield";
import { APIGuild } from "./types";


export enum Roles {
    GuildOwner = "Server Owner",
    GuildAdministrator = "Server Administrator",
    GuildManager = "Server Manager",
    GuildModerator = "Server Moderator",
    NoRole = "No Server Role"
}

export enum PermissionFlags {
    CreateInstantInvite = "CreateInstantInvite",
    KickMembers = "KickMembers",
    BanMembers = "BanMembers",
    Administrator = "Administrator",
    ManageChannels = "ManageChannels",
    ManageGuild = "ManageGuild",
    AddReactions = "AddReactions",
    ViewAuditLog = "ViewAuditLog",
    PrioritySpeaker = "PrioritySpeaker",
    Stream = "Stream",
    ViewChannel = "ViewChannel",
    SendMessages = "SendMessages",
    SendTTSMessages = "SendTTSMessages",
    ManageMessages = "ManageMessages",
    EmbedLinks = "EmbedLinks",
    AttachFiles = "AttachFiles",
    ReadMessageHistory = "ReadMessageHistory",
    MentionEveryone = "MentionEveryone",
    UseExternalEmojis = "UseExternalEmojis",
    ViewGuildInsights = "ViewGuildInsights",
    Connect = "Connect",
    Speak = "Speak",
    MuteMembers = "MuteMembers",
    DeafenMembers = "DeafenMembers",
    MoveMembers = "MoveMembers",
    UseVAD = "UseVAD",
    ChangeNickname = "ChangeNickname",
    ManageNicknames = "ManageNicknames",
    ManageRoles = "ManageRoles",
    ManageWebhooks = "ManageWebhooks",
    ManageEmojisAndStickers = "ManageEmojisAndStickers",
    UseApplicationCommands = "UseApplicationCommands",
    RequestToSpeak = "RequestToSpeak",
    ManageEvents = "ManageEvents",
    ManageThreads = "ManageThreads",
    CreatePublicThreads = "CreatePublicThreads",
    CreatePrivateThreads = "CreatePrivateThreads",
    UseExternalStickers = "UseExternalStickers",
    SendMessagesInThreads = "SendMessagesInThreads",
    UseEmbeddedActivities = "UseEmbeddedActivities",
    ModerateMembers = "ModerateMembers",
};

export type PermissionString = (
    "CreateInstantInvite" |
    "KickMembers" |
    "BanMembers" |
    "Administrator" |
    "ManageChannels" |
    "ManageGuild" |
    "AddReactions" |
    "ViewAuditLog" |
    "PrioritySpeaker" |
    "Stream" |
    "ViewChannel" |
    "SendMessages" |
    "SendTTSMessages" |
    "ManageMessages" |
    "EmbedLinks" |
    "AttachFiles" |
    "ReadMessageHistory" |
    "MentionEveryone" |
    "UseExternalEmojis" |
    "ViewGuildInsights" |
    "Connect" |
    "Speak" |
    "MuteMembers" |
    "DeafenMembers" |
    "MoveMembers" |
    "UseVAD" |
    "ChangeNickname" |
    "ManageNicknames" |
    "ManageRoles" |
    "ManageWebhooks" |
    "ManageEmojisAndStickers" |
    "UseApplicationCommands" |
    "RequestToSpeak" |
    "ManageEvents" |
    "ManageThreads" |
    "CreatePublicThreads" |
    "CreatePrivateThreads" |
    "UseExternalStickers" |
    "SendMessagesInThreads" |
    "UseEmbeddedActivities" |
    "ModerateMembers"
);

export class Permissions {
    public permissions: PermissionString[];
    constructor(permissions: PermissionString[]) {
        this.permissions = permissions;
    }

    has(flag: PermissionString | PermissionFlags) {
        return this.permissions.includes(flag);
    }

    any(flags: (PermissionString | PermissionFlags)[]) {
        return flags.map(flag => this.permissions.includes(flag)).includes(true);
    }

    /*static Resolve(permissions: number) {
        const PermissionsBits = new BitFieldResolvable(
            new BitField(permissions)
        );
        return PermissionsBits;
    }*/

    static Role(guild: APIGuild) {
        const PermissionArray = new Permissions(guild.Permissions as PermissionString[]);

        if (guild.IsOwner) {
            return Roles.GuildOwner;
        } else if (PermissionArray.has(PermissionFlags.Administrator)) {
            return Roles.GuildAdministrator;
        } else if (PermissionArray.any([
            PermissionFlags.ManageGuild,
            PermissionFlags.ManageRoles,
            PermissionFlags.ManageWebhooks,
            PermissionFlags.ManageChannels
        ])) {
            return Roles.GuildManager;
        } else if (PermissionArray.any([
            PermissionFlags.ModerateMembers,
            PermissionFlags.KickMembers,
            PermissionFlags.BanMembers,
            PermissionFlags.ManageMessages,
            PermissionFlags.DeafenMembers,
            PermissionFlags.MoveMembers
        ])) {
            return Roles.GuildModerator;
        } else return Roles.NoRole;
    }
}
