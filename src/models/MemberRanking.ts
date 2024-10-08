import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class MemberRanking {
    @PrimaryColumn()
    CustomId: string;

    @Column()
    MemberId?: string;

    @Column()
    Level?: number;

    @Column()
    LastUpdated?: Date;

    @Column()
    GuildId?: string;

    @Column()
    XP?: number;
}