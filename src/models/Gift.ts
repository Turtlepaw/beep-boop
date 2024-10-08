import { Entity, Column, PrimaryColumn } from "typeorm";
import { Subscriptions } from './Profile';

@Entity()
export class Gift {
    @PrimaryColumn()
    GiftCode: string;

    @Column()
    From: string;

    @Column({ default: false })
    Redeemed: boolean;

    @Column()
    Expires: string;

    @Column({ nullable: true })
    RedeemedAt: string;

    @Column()
    Expired: boolean;

    @Column({ nullable: true })
    Type: Subscriptions;
}