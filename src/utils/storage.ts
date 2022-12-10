import { Client, Guild } from "discord.js";
import { KeyFileStorage } from "key-file-storage/dist/src/key-file-storage";
import "reflect-metadata"
import { CleanupType, GuildConfiguration } from "../models/Configuration";
import { DataSource, DeepPartial, EntityTarget, FindOptionsWhere, ObjectID, ObjectLiteral, Repository } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Profile } from "../models/Profile";
import { CustomWebhook } from "../models/Webhook";
import { Reminder } from "../models/Reminders";
import { MemberRanking } from "../models/MemberRanking";
import { Message } from "../models/Message";
import { JSONArray } from "./jsonArray";

export class ResolvedGuildConfiguration extends GuildConfiguration {
    constructor(options?: any) {
        super();
        Object.entries(options).map(([k, v]) => this[k] = v);
    }

    isReputationModeration() {
        return this?.ReputationMod ?? false;
    }

    isCleanup(type: CleanupType) {
        if (!JSONArray.isArray(this.CleanupType)) return;
        return this.CleanupType.includes(type);
    }

    isSystemCleanup() {
        return this.isCleanup(CleanupType.System);
    }
}

const entities = [GuildConfiguration, CustomWebhook, Profile, MemberRanking, Reminder, Message];
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: entities,
    migrations: [],
    subscribers: [],
}).initialize();

export async function InitializeProvider(client: Client) {
    client.storage = await AppDataSource;
    client.Storage = {
        Configuration: new GuildConfigurationManager(client.storage, GuildConfiguration.name),
        Reminders: new StorageManager(client.storage, Reminder.name),
        Profiles: new StorageManager(client.storage, Profile.name),
        CustomWebhooks: new StorageManager(client.storage, CustomWebhook.name),
        Messages: new StorageManager(client.storage, Message.name)
    }
}

export class StorageManager<repo = any> {
    public Storage: DataSource;
    public Repository: Repository<repo>;
    constructor(storage: DataSource, repository: string) {
        this.Storage = storage;
        this.Repository = storage.getRepository(repository);
    }

    GetAll() {
        try {
            return this.Repository.find();
        } catch (e) {
            return [];
        }
    }

    FindBy(options: FindOptionsWhere<repo> | FindOptionsWhere<repo>[]) {
        return this.Repository.findBy(options);
    }

    FindOneBy(findBy: FindOptionsWhere<repo>): Promise<repo> {
        return this.Get(findBy);
    }

    Get(findBy: FindOptionsWhere<repo> | FindOptionsWhere<repo>[]): Promise<repo> {
        return this.Repository.findOneBy(findBy);
    }

    ResolveArray<arrayType = any>(array: arrayType[]): arrayType[] {
        if (array == null || array.length <= 0) return [];
        return array;
    }

    Create(value: DeepPartial<repo> | DeepPartial<repo>[]) {
        //@ts-expect-error
        return this.Repository.save(value);
    }

    Delete(findBy: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindOptionsWhere<repo>) {
        return this.Repository.delete(findBy);
    }

    async HasInArray(findBy: FindOptionsWhere<repo>, key: string) {
        const found = await this.Repository.findOneBy(findBy) as any[];
        const Resolved = this.ResolveArray<any>(found);
        return Resolved.includes(key);
    }

    async EditOrCreate(findBy: FindOptionsWhere<repo>, newValue: DeepPartial<repo>) {
        const entity = await this.Get(findBy);
        if (entity == null) return this.Create(newValue);
        //@ts-expect-error
        await this.Repository.update(findBy, newValue);
    }

    Edit(findBy: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindOptionsWhere<repo>, newValue: QueryDeepPartialEntity<repo>) {
        return this.Repository.update(findBy, newValue);
    }

    async EditArray(findBy: FindOptionsWhere<repo>, ItemKey: string, AddedItems: repo[]) {
        const value = await this.Repository.findOneBy(findBy) as repo[];
        //@ts-expect-error
        return await this.Repository.update(findBy, [
            ...value,
            ...AddedItems
        ]);
    }
}

export class GuildConfigurationManager extends StorageManager<GuildConfiguration> {
    constructor(storage: DataSource, repository: string) {
        super(storage, repository)
    }

    async AddChannel(ChannelId: string | string[], Id: string) {
        const old = await this.Get({ Id });
        const json = JSONArray.from(old.CleanupChannels);
        if (Array.isArray(ChannelId)) ChannelId.forEach(e => json.push(e))
        else json.push(ChannelId);
        return this.EditOrCreate({
            Id
        }, {
            CleanupChannels: json.toJSON()
        });
    }

    async forGuild(guild: Guild): Promise<ResolvedGuildConfiguration> {
        const config = await this.Get({
            Id: guild.id
        });

        const EmptyArray = JSON.stringify({
            array: []
        });

        const EmptyResolvableArray = () => new JSONArray();

        if (config == null) {
            this.Create({
                CleanupChannels: EmptyArray,
                CleanupTimer: null,
                CleanupType: EmptyArray,
                Color: null,
                Id: guild.id,
                MaxReputation: 5,
                ModerationChannel: null,
                ModerationType: EmptyArray,
                ReputationMod: false
            })
        }

        return new ResolvedGuildConfiguration({
            CleanupChannels: config?.CleanupChannels == null ? EmptyResolvableArray() : JSONArray.from(config?.CleanupChannels),
            CleanupTimer: config?.CleanupTimer || null,
            CleanupType: config?.CleanupType == null ? EmptyResolvableArray() : JSONArray.from(config?.CleanupType),
            Color: config?.Color || null,
            Id: config?.Id ?? guild.id,
            MaxReputation: config?.MaxReputation || 5,
            ModerationChannel: config?.ModerationChannel || null,
            ModerationType: config?.ModerationType == null ? EmptyResolvableArray() : JSONArray.from(config?.ModerationType),
            ReputationMod: config?.ReputationMod || false
        });
    }
}