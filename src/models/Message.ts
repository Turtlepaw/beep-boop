import { ColorResolvable, HexColorString } from 'discord.js';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, Generated } from "typeorm"

@Entity()
export class Message {
    @PrimaryColumn({ type: "integer", generated: true })
    Entity: number;

    @Column()
    Message: string;

    @Column()
    Channel: string;

    @Column()
    Type: MessageType;

    @Column()
    CustomName: string;

    @Column()
    Author: string;

    @Column()
    CreatedAt: number;

    @Column()
    Guild: string;
}

export enum MessageType {
    SystemMessage = "SYSTEM_MESSAGE",
    CleanupMessage = "CLEANUP_MESSAGE"
}