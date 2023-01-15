import { HexColorString } from 'discord.js';
import { JSONArray } from '../utils/jsonArray';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"
import { Subscriptions } from './Profile';
import { DateTransformer } from '../utils/transformers';

@Entity()
export class APIUser {
    @PrimaryGeneratedColumn()
    Id: string;

    @Column()
    User: string;

    @Column()
    Token: string;
}