import { HexColorString } from 'discord.js';
import { JSONArray } from 'src/utils/jsonArray';
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
    @PrimaryColumn()
    Id: string;

    // Premium
    @Column()
    Color: HexColorString;

    // Autonomous Cleaning
    @Column()
    CleanupType: string | CleanupType[] | JSONArray<CleanupType> | undefined[]; //CleanupType[];
    @Column()
    CleanupTimer: number;
    @Column()
    CleanupChannels: string;

    // Reputation Based Moderation
    @Column()
    ReputationMod: boolean;
    @Column()
    MaxReputation: number;
    @Column()
    ModerationType: string | ReputationBasedModerationType[] | JSONArray<ReputationBasedModerationType> | undefined[]; //ReputationBasedModerationType[];

    // Logs
    @Column()
    ModerationChannel: string;
}

export class ResolvedGuildConfiguration extends GuildConfiguration {
    constructor() {
        super()
    }

    declare public CleanupType: CleanupType[];
    declare ModerationType: ReputationBasedModerationType[];
}