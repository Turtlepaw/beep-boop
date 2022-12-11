import { ColorResolvable, HexColorString } from 'discord.js';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

export enum Subscriptions {
    Plus = "PRO_PLUS",
    Pro = "PRO",
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

    @Column({ nullable: true })
    expires: string;
}