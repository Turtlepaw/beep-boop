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
    Transcripts = "/v1/transcripts/:id"
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
    Features: string[];
}

export interface APIChannel {
    Id: string;
    Name: string;
}