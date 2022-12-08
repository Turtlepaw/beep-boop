import { ColorResolvable, HexColorString } from 'discord.js';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Profile {
    @PrimaryColumn()
    userId: string;

    @Column()
    displayName: string;

    @Column()
    bio: string;

    @Column()
    reputation: number;

    @Column()
    accentColor: ColorResolvable;
}