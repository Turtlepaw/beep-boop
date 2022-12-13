import { HexColorString } from 'discord.js';
import { JSONArray } from '../utils/jsonArray';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

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

@Entity()
export class GuildConfiguration {
    @PrimaryGeneratedColumn({ type: "integer" })
    CustomId: number;

    // @PrimaryColumn({ generated: true })
    // CustomId: string;

    @Column()
    Id: string;

    // Premium
    @Column({ nullable: true })
    Color: HexColorString | string;

    // Autonomous Cleaning
    @Column()
    CleanupType: string // | CleanupType[] | JSONArray<CleanupType> | undefined[]; //CleanupType[];
    @Column({ nullable: true })
    CleanupTimer: number;
    @Column()
    CleanupChannels: string;

    // Reputation Based Moderation
    @Column()
    ReputationMod: boolean;
    @Column()
    MaxReputation: number;
    @Column()
    ModerationType: string // | JSONArray<ReputationBasedModerationType> | undefined[]; //ReputationBasedModerationType[];

    // Tickets
    @Column({ nullable: true })
    TicketCategory: string;

    // Logs
    @Column({ nullable: true })
    ModerationChannel: string | null;

    @Column({ nullable: true, default: false })
    InviteBlocker: boolean;
}