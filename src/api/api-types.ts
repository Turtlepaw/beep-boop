export enum Routes {
    GuildConfiguration = "/v1/settings/:guildId",
    Index = "/v1/",
    OAuth = "/v1/oauth",
    GuildsWith = "/v1/guilds",
    Channels = "/v1/channels",
    CreateMessage = "/v1/message/create",
    RoleConnections = "/v1/role-connections/verify",
    Subscription = "/v1/subscription/:guildId",
    //Module store
    Modules = "/v1/modules/:id",
    Module = "/v1/module",
    //Public Routes
    Profile = "/v1/profile/:id",
    Ranking = "/v1/rank/:id",
    Leaderboard = "/v1/leaderboard/:id"
}

export interface OAuthUser {
    access_token: string;
    token_type: string;
    jwt_token: string;
}

export interface APIGuild {
    Id: string;
    Name: string;
    IconHash: string | null;
    IconURL: string | null;
    IsOwner: boolean; //if they are the owner
    Permissions: string[];
    Features: any[];
}

export interface APIChannel {
    Id: string;
    Name: string;
}