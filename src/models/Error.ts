import { HexColorString } from 'discord.js';
import { JSONArray } from '../utils/jsonArray';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"
import { Subscriptions } from './Profile';
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