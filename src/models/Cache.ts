import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Cache<T> {
    @PrimaryGeneratedColumn()
    Id: string;

    @Column()
    key: string;

    @Column()
    value: string;
}