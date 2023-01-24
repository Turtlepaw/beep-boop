import { Client } from "discord.js";
import "reflect-metadata"
import { CleanupType, CounterChannel, GuildConfiguration, JoinActions, JoinTriggers, ReputationBasedModerationType, VerificationLevel, VerificationPanel } from "../models/Configuration";
import { DataSource, DeepPartial, FindOptionsWhere, ObjectID, Repository } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CustomBot } from "../models/CustomBot";
import { JSONArray } from "./jsonArray";
// Import Models
import { Profile } from "../models/Profile";
import { CustomWebhook } from "../models/Webhook";
import { Reminder } from "../models/Reminders";
import { MemberRanking } from "../models/MemberRanking";
import { Message } from "../models/Message";
import { Gift } from "../models/Gift";
import { OAuth } from "../models/OAuth";
import { Action } from "../models/Action";
import { Error as CustomError } from "../models/Error";
import { APIUser } from "../models/APIUser";
import { Ticket } from "../models/Ticket";
import { ConfigurationEvents } from "../@types/Logging";

export interface CleanupChannel {
    Type: CleanupType;
    ChannelId: string;
}

class ResolvableConfiguration {
    // Guild Information
    public CustomId: number;
    public Id: string;
    public Name: string;

    // Autonomous Cleanup
    public CleanupChannels: CleanupChannel[];
    public CleanupTimer: number;
    public CleanupType: CleanupType[];

    // Counter Channels
    public CounterChannels: Map<string, CounterChannel>;

    // Premium (basic and pro)
    public Color: string;
    public Premium: boolean;

    // [deprecated] Reputation Based Moderation
    public MaxReputation: number;
    public ModerationChannel: string;
    public ModerationType: JSONArray<ReputationBasedModerationType>;
    public ReputationMod: boolean;

    // Verification
    public Verification: {
        Status: boolean;
        Level: VerificationLevel;
        Panels: VerificationPanel[];
        Roles: string[];
    }

    // Appeals
    public Appeals: {
        Status: boolean;
        Channel: string;
        Blocked: Set<string>;
    };

    // Invite Blocker
    public InviteBlocker: {
        Status: boolean;
        Exceptions: string[];
    };

    // Starboard
    public Starboard: {
        Channel: string;
        Status: boolean;
        Reaction: string;
    };

    // Tickets
    public Tickets: {
        Status: boolean;
        Category: string;
    };

    // Join Actions
    public ActionsDetails: {
        MaxReputation: number;
        NicknamePrefix: string;
    };

    public Actions: {
        Action: JoinActions;
        Trigger: JoinTriggers;
    }[];

    // Logging
    public Logging: {
        Status: boolean;
        Categories: Set<ConfigurationEvents>;
    }
    // Raw configuration
    public raw: GuildConfiguration;
}

export class ResolvedGuildConfiguration extends ResolvableConfiguration {
    constructor(options?: ResolvableConfiguration) {
        super();
        Object.entries(options).map(([k, v]) => this[k] = v);
    }

    isPremium() {
        return this?.Premium ?? false;
    }

    isVerification() {
        return this?.Verification ?? false;
    }

    isReputationModeration() {
        return this?.ReputationMod ?? false;
    }

    hasAppeals() {
        return this.Appeals.Status;
    }

    isUserAppealBlocked(userId: string) {
        return this.Appeals.Blocked.has(userId);
    }

    isCleanup(type: CleanupType) {
        if (!Array.isArray(this.CleanupType)) return false;
        return this.CleanupType.includes(type);
    }

    getCleanupChannels(type: CleanupType) {
        if (this?.CleanupChannels == null) return [];
        return this.CleanupChannels.filter(e => e.Type != type);
    }

    isSystemCleanup() {
        return this.isCleanup(CleanupType.System);
    }

    hasCounterChannels() {
        return this?.CounterChannels != null && this.CounterChannels.size >= 1;
    }

    hasTickets() {
        return this?.Tickets?.Status ?? false;
    }

    hasTicketsSetup() {
        return this?.Tickets?.Category != null;
    }

    isMessageCleanup() {
        return this.isCleanup(CleanupType.Message);
    }

    isTimedCleanup() {
        return this.isCleanup(CleanupType.Timed);
    }

    isInviteBlocker() {
        return this?.InviteBlocker?.Status ?? false;
    }
}

const entities = [
    GuildConfiguration,
    CustomWebhook,
    Profile,
    MemberRanking,
    Reminder,
    Message,
    CustomBot,
    Gift,
    OAuth,
    Action,
    APIUser,
    Ticket,
    CustomError
];

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
        Messages: new StorageManager(client.storage, Message.name),
        CustomBots: new StorageManager(client.storage, CustomBot.name),
        Gifts: new StorageManager(client.storage, Gift.name),
        OAuth: new StorageManager(client.storage, OAuth.name),
        Actions: new StorageManager(client.storage, Action.name),
        Errors: new StorageManager(client.storage, CustomError.name),
        ApiUsers: new StorageManager(client.storage, APIUser.name),
        Tickets: new StorageManager(client.storage, Ticket.name),
    }
}

export class StorageManager<repo = unknown> {
    public Storage: DataSource;
    public Repository: Repository<repo>;
    constructor(storage: DataSource, repository: string) {
        this.Storage = storage;
        this.Repository = storage.getRepository(repository);
    }

    GetAll(): Promise<repo[]> {
        try {
            return this.Repository.find();
        } catch (e) {
            console.log("error".red, e, e?.stack)
            return Promise.resolve<repo[]>([]);
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

    ResolveArray<arrayType = unknown>(array: arrayType[]): arrayType[] {
        if (array == null || array.length <= 0) return [];
        return array;
    }

    Create(value: DeepPartial<repo> | DeepPartial<repo>[]) {
        //@ts-expect-error we're giving the correct data
        return this.Repository.save(value);
    }

    Delete(findBy: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindOptionsWhere<repo>) {
        return this.Repository.delete(findBy);
    }

    async HasInArray(findBy: FindOptionsWhere<repo>, key: string) {
        const found = await this.Repository.findOneBy(findBy) as unknown[];
        const Resolved = this.ResolveArray<unknown>(found);
        return Resolved.includes(key);
    }

    async EditOrCreate(findBy: FindOptionsWhere<repo>, newValue: DeepPartial<repo>) {
        const entity = await this.Get(findBy);
        if (entity == null) return this.Create(newValue);
        //@ts-expect-error newValue should be working
        await this.Repository.update(findBy, newValue);
    }

    Edit(findBy: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindOptionsWhere<repo>, newValue: QueryDeepPartialEntity<repo>) {
        return this.Repository.update(findBy, newValue);
    }

    async EditArray(findBy: FindOptionsWhere<repo>, ItemKey: string, AddedItems: repo[]) {
        const value = await this.Repository.findOneBy(findBy) as repo[];
        //@ts-expect-error this is correct
        return await this.Repository.update(findBy, [
            ...value,
            ...AddedItems
        ]);
    }
}

export class GuildConfigurationManager extends StorageManager<GuildConfiguration> {
    public CreatedGuilds: string[] = [];
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
            CleanupChannels: []
        });
    }

    CreateConfiguration(guild: { id: string; name: string; }) {
        return this.Repository.save({
            // Server Information
            Id: guild.id,
            Name: guild.name,
            // Autonomous Cleaning
            CleanupChannels: [],
            CleanupTimer: null,
            CleanupType: [],
            // Premium
            Color: null,
            // Invite Blocker
            InviteBlockerStatus: false,
            InviteBlockerExceptions: [],
            // appeals
            Appeals: false,
            AppealChannel: null,
            AppealBlocks: new Set<string>(),
            //counter channels
            CounterChannels: new Map(),
            // premium
            Premium: false,
            // verification
            Verification: false,
            VerificationLevel: VerificationLevel.Medium,
            VerificationRoles: [],
            VerificationPanels: [],
            // [deprecated] Reputation Based Moderation
            ReputationMod: false,
            MaxReputation: 5,
            ModerationType: "",
            // Logs
            ModerationChannel: null,
            ModerationChannels: [],
            // Highlights (known as Starboard)
            StarboardReaction: "⭐",
            StarboardChannel: null,
            StarboardStatus: false,
            // Join Actions
            ActionsMaxReputation: 2,
            ActionsNicknamePrefix: null,
            Actions: [],
            // Tickets
            TicketsCategory: null,
            TicketsStatus: false
        });
    }

    async forGuild(guild: { id: string; name: string; }): Promise<ResolvedGuildConfiguration> {
        const config = await this.Get({
            Id: guild.id
        });

        const EmptyResolvableArray = () => new JSONArray();

        //if (config == null) return null; //this.CreateConfiguration(guild);


        return new ResolvedGuildConfiguration({
            // Guild Information
            CustomId: config?.CustomId,
            Id: config?.Id ?? guild.id,
            Name: config?.Name ?? guild.name,
            // Autonomous Cleanup
            CleanupChannels: config?.CleanupChannels == null ? [] : config.CleanupChannels,
            CleanupTimer: config?.CleanupTimer || null,
            CleanupType: config?.CleanupType == null ? [] : config.CleanupType,
            // Premium (basic and pro)
            Color: config?.Color ?? null,
            Premium: config?.Premium ?? false,
            // Counter channels
            CounterChannels: config?.CounterChannels ?? new Map(),
            // Verification
            Verification: {
                Status: config?.Verification ?? false,
                Level: config?.VerificationLevel ?? VerificationLevel.Low,
                Panels: config?.VerificationPanels ?? [],
                Roles: config?.VerificationRoles ?? []
            },
            // [deprecated] Reputation Based Moderation
            MaxReputation: config?.MaxReputation || 5,
            ModerationChannel: config?.ModerationChannel || null,
            ModerationType: config?.ModerationType == null ? EmptyResolvableArray() : JSONArray.from(config?.ModerationType),
            ReputationMod: config?.ReputationMod ?? false,
            // Invite Blocker
            InviteBlocker: {
                Status: config?.InviteBlockerStatus ?? false,
                Exceptions: config?.InviteBlockerExceptions == null ? [] : config?.InviteBlockerExceptions
            },
            // Starboard
            Starboard: {
                Channel: config?.StarboardChannel || null,
                Status: config?.StarboardStatus ?? false,
                Reaction: config?.StarboardReaction ?? "⭐"
            },
            // Appeals
            Appeals: {
                Status: config?.Appeals ?? false,
                Channel: config?.AppealChannel,
                Blocked: config?.AppealBlocks ?? new Set()
            },
            // Tickets
            Tickets: {
                Category: config?.TicketsCategory,
                Status: config?.TicketsStatus
            },
            // Join Actions
            ActionsDetails: {
                MaxReputation: config?.ActionsMaxReputation,
                NicknamePrefix: config?.ActionsNicknamePrefix
            },
            Actions: config?.Actions == null ? [] : config.Actions.map(e => ({
                Action: e[1],
                Trigger: e[0]
            })),
            Logging: {
                Status: config?.LoggingStatus ?? false,
                Categories: config?.LoggingCategories ?? new Set<ConfigurationEvents>()
            },
            // Raw configuration
            raw: config
        });
    }
}