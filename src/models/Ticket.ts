import { EmbedData } from 'discord.js';
import { Entity, Column, PrimaryColumn } from "typeorm";
import { DateTransformer, MapTransformer } from "../utils/transformers";

export interface DatabaseUser {
    Avatar: string;
    Username: string;
    Tag: string;
}

export interface TicketMessage {
    Id: string;
    Content: string;
    User: DatabaseUser;
    /**
     * use a `Date()` but stringify it.
     */
    Date: string;
    Embeds: EmbedData[];
}

@Entity()
export class Ticket {
    @PrimaryColumn({ type: "integer", generated: true })
    Entity: number;

    @Column()
    CreatedBy: string;
    @Column({ transformer: new DateTransformer() })
    CreatedAt: Date;
    @Column({ nullable: true })
    ClosedBy: string;
    @Column({ transformer: new DateTransformer() })
    ClosedAt: Date;
    @Column()
    ChannelId: string;
    @Column()
    GuildId: string;
    @Column()
    Reason: string;
    @Column({ transformer: new MapTransformer<string, TicketMessage>(), type: "varchar" })
    Messages: Map<string, TicketMessage>;
}