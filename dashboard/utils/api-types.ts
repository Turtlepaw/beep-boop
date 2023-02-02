export enum Routes {
    GuildConfiguration = "/v1/settings/:guildId",
    Index = "/v1/",
    OAuth = "/v1/oauth",
    GuildsWith = "/v1/guilds",
    Channels = "/v1/channels",
    CreateMessage = "/v1/message/create",
    RoleConnections = "/v1/role-connections/verify",
    Subscription = "/v1/subscription/:guildId",
    //API Users
    ApiUser = "/v1/api-users/:id",
    //Module store
    Modules = "/v1/modules/:id",
    Module = "/v1/module",
    //Public Routes
    Profile = "/v1/profile/:id",
    Ranking = "/v1/rank/:id",
    Leaderboard = "/v1/leaderboard/:id",
    //Tickets
    Transcripts = "/v1/transcripts/:id",
    TicketData = "/v1/ticket/:id"
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
    Events: any[];
    Commands: any[];
    ContextMenus: any[];
}

export interface Action {
    Id: string;
    Name: string;
    Description: string;
    Author: ResolvableAuthor;
    InternalCode: InternalCode;
    ConfigurationParams: ActionConfiguration;
}

export interface DatabaseUser {
    Avatar: string;
    Username: string;
    Tag: string;
    Bot: boolean;
    Color?: string;
    Id: string;
}

export interface ButtonComponent {
    label: string;
    style: number;
}

export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface EmbedData {
    title?: string;
    fields?: EmbedField[];
}

export interface TicketMessage {
    Id: string;
    Content: string;
    User: DatabaseUser;
    /**
     * use a `Date()` but stringify it.
     */
    Date: string;
    Embeds: EmbedData[];
    Components: ButtonComponent[];
}

export interface ApiError {
    eror: boolean;
    message: string;
    code: number;
}

export interface ApiTicket {
    Creator: DatabaseUser;
}