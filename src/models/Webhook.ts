import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class CustomWebhook {
    @PrimaryColumn()
    url: string;

    @Column()
    channelId: string;
}