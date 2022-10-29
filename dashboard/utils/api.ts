import fetch from "node-fetch";
import { APIGuild } from "./types";
const URL = "https://turtlepaw-beep-boop-p6qqgwgqr7v39wjj-4000.preview.app.github.dev";

export enum Routes {
    AppealSettings = "/settings/appeals",
    Index = "/",
    OAuth = "/oauth",
    GuildsWith = "/guilds",
    Channels = "/channels"
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

export function CreateRoute(route: Routes) {
    return URL + route;
}

export interface OAuthUser {
    access_token: string;
    token_type: string;
    jwt_token: string;
}

export enum Methods {
    Get = "GET",
    Post = "POST",
    Delete = "DELETE"
}

export async function GetUser(Id: string): Promise<OAuthUser> {
    const Result = await fetch(CreateRoute(Routes.OAuth) + `?id=${Id}`, {
        method: Methods.Get,
    });

    return Result.json();
}

export async function DeleteUser(Id: string): Promise<any> {
    const Result = await fetch(CreateRoute(Routes.OAuth), {
        method: Methods.Delete,
        body: JSON.stringify({
            id: Id
        }),
    });

    return Result.json();
}

export async function CreateUser(Id: string, Options: OAuthUser): Promise<any> {
    const Result = await fetch(CreateRoute(Routes.OAuth), {
        method: Methods.Post,
        body: JSON.stringify({
            id: Id,
            access_token: Options.access_token || "null",
            jwt_token: Options.jwt_token || "null",
            token_type: Options.token_type || "null"
        })
    });

    return Result.json();
}

export async function GetGuildsWith(Id: string): Promise<APIGuild[]> {
    const Result = await fetch(CreateRoute(Routes.GuildsWith) + `?id=${Id}`, {
        method: Methods.Get
    });

    return Result.json();
}

export async function GetChannels(Id: string): Promise<APIGuild[]> {
    const Result = await fetch(CreateRoute(Routes.Channels) + `?id=${Id}`, {
        method: Methods.Get
    });

    return Result.json();
}

export async function GetAppeals(Id: string): Promise<string> {
    const Result = await fetch(CreateRoute(Routes.AppealSettings) + `?id=${Id}`, {
        method: Methods.Get
    });

    return Result.json();
}

export async function SetAppeals(Id: string, ChannelId: string): Promise<any> {
    const Result = await fetch(CreateRoute(Routes.AppealSettings), {
        method: Methods.Post,
        body: JSON.stringify({
            id: Id,
            channel: ChannelId
        })
    });

    return Result.json();
}