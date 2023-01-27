import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class APIUser {
    @PrimaryGeneratedColumn()
    Id: string;

    @Column()
    User: string;

    @Column()
    Token: string;
}