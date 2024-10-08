import { ActivityType } from 'discord.js';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CustomBot {
    @PrimaryGeneratedColumn()
    CustomId: string;

    // Premium
    @Column()
    Token: string;

    @Column()
    GuildId: string;

    @Column()
    Owner: string;

    @Column()
    BotId: string;

    @Column({ nullable: true })
    LoggingChannel: string;

    @Column({ nullable: true })
    CustomStatus: string;

    @Column({ nullable: true })
    CustomStatusType: ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing;

    @Column({ nullable: true })
    CustomStatusPresence: "dnd" | "online" | "invisible" | "idle";

    @Column({ nullable: true })
    WebhookURL: string;
}