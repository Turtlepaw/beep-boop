import { Events, HexColorString } from 'discord.js';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { JSONTransformer, MapTransformer, SetTransformer } from '../utils/transformers';
import { ConfigurationEvents } from '../@types/Logging';

export enum CleanupType {
    System = "SYSTEM_CLEANUP",
    Message = "MEMBER_MESSAGES",
    Timed = "TIMED_CLEANING"
}

export enum ReputationBasedModerationType {
    AsWarn = "AS_MODERATOR_WARNING",
    AsBan = "AS_MEMBER_BAN",
    AsKick = "AS_MEMBER_KICK"
}

export enum JoinTriggers {
    Reputation = "REPUTATION_BELOW",
    Suspicious = "SUSPICIOUS",
    Any = "ANY"
}

export enum JoinActions {
    SendVerification = "VERIFY_USER",
    Warn = "WARN_MODERATORS",
    RemoveZalgo = "REMOVE_ZALGO",
    PrefixUsername = "PREFIX_USERNAME",
    AddRole = "ADD_ROLE",
    AddRoleAfterVerification = "ADD_ROLE_AFTER_VERIFICATION",
    AddRoleAfterServerScreen = "ADD_ROLE_AFTER_SERVER_SCREEN"
}

export enum CounterType {
    Members = "MEMBERS",
    HumanMembers = "MEMBERS_EXLCUDE_BOTS"
}

export interface CounterChannel {
    Id: string;
    Name: string;
    Disabled: boolean;
}

export enum VerificationLevel {
    Low = "Simple",
    Medium = "Balanced",
    High = "Secure"
}

export interface VerificationPanel {
    Channel: string;
    Message: string;
}

@Entity()
export class GuildConfiguration {
    @PrimaryGeneratedColumn({ type: "integer" })
    CustomId: number;

    // Server Information
    // -> Basic information about the server.
    @Column()
    Id: string;
    @Column()
    Name: string;

    // Premium (basic and pro)
    // -> https://bop.trtle.xyz/pro
    @Column({ nullable: true })
    Color: HexColorString | string;

    @Column({ nullable: true, default: false })
    Premium: boolean;

    // Appeals
    // -> Let members appeal their punishments
    @Column({ nullable: true })
    Appeals: boolean;
    @Column({ nullable: true })
    AppealChannel: string;
    @Column({ nullable: true, transformer: new SetTransformer<string>(), type: "varchar" })
    AppealBlocks: Set<string>;

    // Verification
    // -> Verify users, etc...
    @Column({ nullable: true })
    Verification: boolean;
    @Column({ nullable: true })
    VerificationLevel: VerificationLevel;
    @Column({ nullable: true, type: "simple-array" })
    VerificationPanels: VerificationPanel[];
    @Column({ nullable: true, type: "simple-array" })
    VerificationRoles: string[];

    // Counter Channels
    // -> Show counts of multiple things
    @Column({ type: "varchar", nullable: true, transformer: new MapTransformer<string, CounterChannel>() })
    CounterChannels: Map<string, CounterChannel>;

    // Autonomous Cleaning
    // -> Clean up old messages from members.
    @Column({ type: "simple-array" })
    CleanupType: CleanupType[]; // | CleanupType[] | JSONArray<CleanupType> | undefined[]; //CleanupType[];
    @Column({ nullable: true })
    CleanupTimer: number;
    @Column({ type: "varchar", transformer: JSONTransformer })
    CleanupChannels: {
        Type: CleanupType;
        ChannelId: string;
    }[];

    // [deprecated] Reputation Based Moderation
    // -> Set up actions when a member when low
    //    reputation joins.
    // -> Deprecation notice: use join Actions instead
    @Column()
    ReputationMod: boolean;
    @Column()
    MaxReputation: number;
    @Column()
    ModerationType: string; // | JSONArray<ReputationBasedModerationType> | undefined[]; //ReputationBasedModerationType[];

    // Tickets
    // -> Let members have a private discussion
    //    with moderators.
    @Column({ nullable: true })
    TicketsStatus: boolean;
    @Column({ nullable: true })
    TicketsCategory: string;

    // Logs
    // -> Log everything going on in
    //    your community
    @Column({ nullable: true })
    ModerationChannel: string | null;
    @Column({ type: "varchar", nullable: true, transformer: JSONTransformer })
    ModerationChannels: {
        Channel: string;
        Events: Events[]
    }[];

    // Invite Blocker
    // -> Blocks members from sending invites
    //    by scanning the url.
    @Column({ nullable: true })
    InviteBlockerStatus: boolean;
    @Column({ nullable: true, type: "simple-array" })
    InviteBlockerExceptions: string[];

    // Invite Blocker
    // -> Set up actions to run when a member
    //    joins your community.
    @Column({ nullable: true, type: "simple-array" })
    Actions: ([JoinTriggers, JoinActions])[];
    @Column({ nullable: true })
    ActionsMaxReputation: number;
    @Column({ nullable: true })
    ActionsNicknamePrefix: string;

    // Highlighs (known as Starboard)
    // -> Highlight the best and brightest
    //    messages in your community.
    @Column({ nullable: true, default: false })
    StarboardStatus: boolean;
    @Column({ nullable: true })
    StarboardChannel: string;
    @Column({ nullable: true, default: "⭐" })
    StarboardReaction: string;
    @Column({ nullable: true, default: 5 })
    StarboardReactionCount: number;

    // Logging
    // -> Log your server's most important events
    //    and keep an eye on your server.
    @Column({ nullable: true, default: false })
    LoggingStatus: boolean;
    @Column({ nullable: true, transformer: new SetTransformer<ConfigurationEvents>(), type: "varchar" })
    LoggingCategories: Set<ConfigurationEvents>;
    @Column({ nullable: true })
    LoggingChannel: string;

    // Leave Feedback
    // -> Gather feedback on members leaving
    @Column({ nullable: true, default: false })
    LeaveFeedbackStatus: boolean;

    @Column({ nullable: true })
    LeaveFeedbackChannel: string;
}