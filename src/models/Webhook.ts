import { ColorResolvable, HexColorString } from 'discord.js';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class CustomWebhook {
    @PrimaryColumn()
    url: string;

    @Column()
    channelId: string;
}