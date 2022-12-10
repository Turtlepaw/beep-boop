import { HexColorString } from 'discord.js';
import { JSONArray } from '../utils/jsonArray';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class CustomBot {
    @PrimaryGeneratedColumn()
    CustomId: string;

    // Premium
    @Column()
    Token: string;
}