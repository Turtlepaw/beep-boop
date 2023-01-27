import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Reminder {
    @PrimaryColumn()
    CustomId: string;

    @Column()
    Id: string;
    @Column()
    Title: string;
    @Column()
    Time: number;
    @Column()
    Reminded: boolean;
    @Column()
    CreatedAt: number;
}