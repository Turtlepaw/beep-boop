import { Events, HexColorString } from 'discord.js';
import { JSONArray } from '../utils/jsonArray';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ValueTransformer } from "typeorm"
import { JSONTransformer } from '../utils/transformers';

@Entity()
export class OAuth {
    @PrimaryGeneratedColumn({ type: "integer" })
    Id: number;

    @Column()
    access_token: string;
    @Column()
    token_type: string;
    @Column()
    jwt_token: string;

    @Column()
    User: string;
}