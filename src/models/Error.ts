import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DateTransformer } from '../utils/transformers';

@Entity()
export class Error {
    @PrimaryGeneratedColumn()
    Error: string;

    @Column()
    Title: string;

    @Column()
    Stack: string;

    @Column()
    CreatedBy: string;

    @Column({ transformer: new DateTransformer() })
    CreatedAt: Date;
}