import { ColorResolvable, HexColorString } from 'discord.js';
import { SetTransformer } from '../utils/transformers';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

export enum Subscriptions {
    Pro = "PRO",
    Basic = "PRO_BASIC",
    None = "NONE"
}

@Entity()
export class Profile {
    @PrimaryColumn()
    userId: string;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    bio: string;

    @Column()
    reputation: number;

    @Column({ nullable: true })
    accentColor: string;

    @Column()
    subscription: Subscriptions;

    @Column({ type: "varchar", transformer: new SetTransformer<string>(), nullable: true })
    guilds: Set<string>;

    @Column({ nullable: true })
    expires: string;
}