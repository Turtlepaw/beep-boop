export enum Routes {
    GuildConfiguration = "/v1/settings/:guildId",
    Index = "/v1/",
    OAuth = "/v1/oauth",
    GuildsWith = "/v1/guilds",
    Channels = "/v1/channels",
    CreateMessage = "/v1/message/create",
    RoleConnections = "/v1/role-connections/verify",
    Subscription = "/v1/subscription/:guildId"
}

enum Status {
    Initialized = 1,
    Error = 2,
    Success = 3,
    NotFound = 4
}

enum Messages {
    Initialized = 'SERVER_INITIALIZED_AND_READY',
    Error = 'SERVER_ERROR',
    Success = 'SERVER_SUCCESS',
    NotFound = 'NOT_FOUND_ON_SERVER'
}

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
    @Column()
    Author: ResolvableAuthor;
    @Column()
    InternalCode: InternalCode;
    @Column()
    ConfigurationParams: ActionConfiguration;
}