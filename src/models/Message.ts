import { ColorResolvable, HexColorString } from 'discord.js';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Message {
    @PrimaryColumn()
    MessageId: string;

    @Column()
    ChannelId: string;

    @Column()
    Type: MessageType;

    @Column()
    CustomId: string;

    @Column()
    AuthorId: string;
}

export enum MessageType {
    SystemMessage = "SYSTEM_MESSAGE",
    CleanupMessage = "CLEANUP_MESSAGE"
}