import { HexColorString } from 'discord.js';
import { JSONArray } from '../utils/jsonArray';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"
import { Subscriptions } from './Profile';
import Event from '../lib/Event';
import Command from '../lib/CommandBuilder';
import ContextMenu from '../lib/ContextMenuBuilder';

export enum ActionParam {
    Boolean = "boolean",
    String = "string",
    StringWithVaribles = "string_with_vars"
}

export interface ActionConfiguration {
    [key: string]: {
        Name: string;
        Type: ActionParam;
        DefaultValue?: any;
    };
};

export interface ResolvableAuthor {
    Avatar: string;
    Username: string;
    Tag: string;
};

export interface InternalCode {
    Events: Event[];
    Commands: Command[];
    ContextMenus: ContextMenu[];
}

@Entity()
export class Action {
    @PrimaryGeneratedColumn()
    Id: string;
    @Column()
    Name: string;
    @Column()
    Description: string;
    @Column({ type: "simple-json" })
    Author: ResolvableAuthor;
    @Column({ type: "simple-json" })
    InternalCode: InternalCode;
    @Column({ type: "simple-json" })
    ConfigurationParams: ActionConfiguration;
    @Column({ nullable: true })
    Approved: boolean;
    @Column({ nullable: true })
    Verified: boolean;
}