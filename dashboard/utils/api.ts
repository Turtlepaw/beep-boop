import fetch from "node-fetch";
import { config } from "./config";
import { APIGuild } from "./types";
import { ApiError, ApiTicket, Routes, TicketMessage } from "./api-types";
import { resourceUsage } from "process";
const URL = process.env.API_URI || "http://localhost:4000";
const token = `${process.env.API_TOKEN}` || "Bearer api_token_1490ujdsifh9124yf";
//const URL = "https://turtlepaw-beep-boop-p6qqgwgqr7v39wjj-4000.preview.app.github.dev";

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

export enum ActionParam {
    Boolean = "boolean",
    String = "string",
    StringWithVaribles = "string_with_vars"
}

export interface Action {
    Id: string;
    Name: string;
    Description: string;
    Author: {
        Avatar: string;
        Username: string;
        Tag: string;
    };
    InternalCode: string;
    ConfigurationParams: {
        [key: string]: {
            Name: string;
            Type: ActionParam;
            DefaultValue?: any;
        };
    };
}

export async function GetActions(): Promise<Action[]> {
    return CallAPI(CreateRoute(Routes.Modules.replace(":id", "all") as Routes));
    return [{
        Name: "Nickname Manager",
        Author: {
            Avatar: "https://cdn.discordapp.com/avatars/820465204411236362/aa4ece5f0f241fad5e3e554e5ef63887.webp",
            Tag: "Turtlepaw#0001",
            Username: "Turtlepaw"
        },
        Description: "Manages member's nicknames.",
        ConfigurationParams: {
            OnJoin: {
                Type: ActionParam.Boolean,
                Name: "On Member Join",
                DefaultValue: true
            },
            NicknameBase: {
                Type: ActionParam.String,
                Name: "Nickname"
            }
        },
        Id: "any_id",
        InternalCode: "new NickManger().execute();"
    }];
}

export async function Transcript(id: string) {
    return CallAPI<TicketMessage[]>(CreateRoute(Routes.Transcripts.replace(":id", id) as Routes));
}

export async function TicketData(id: string) {
    return CallAPI<ApiTicket>(CreateRoute(Routes.TicketData.replace(":id", id) as Routes));
}

export async function GetUser(Id: string): Promise<OAuthUser> {
    const Result = await fetch(CreateRoute(Routes.OAuth) + `?id=${Id}`, {
        method: Methods.Get,
        headers: {
            Authorization: token
        }
    });

    return Result.json();
}

export async function DeleteUser(Id: string): Promise<any> {
    const Result = await fetch(CreateRoute(Routes.OAuth), {
        method: Methods.Delete,
        body: JSON.stringify({
            id: Id
        }),
        headers: {
            Authorization: token
        }
    });

    return Result.json();
}

export async function CreateUser(Id: string, Options: OAuthUser): Promise<any> {
    return CallAPI(CreateRoute(Routes.OAuth), Methods.Post, {
        id: Id,
        access_token: Options.access_token || "null",
        jwt_token: Options.jwt_token || "null",
        token_type: Options.token_type || "null"
    });
}

export interface ApiResult<T> {
    isError: () => boolean;
    fullResult: T;
}

export async function CallAPI<T>(url: string, method?: Methods, body?: object): Promise<T & ApiResult<T>> {
    console.log(url)
    const Result = await fetch(url, {
        method: method ?? Methods.Get,
        body: body == null ? null : JSON.stringify(body),
        headers: {
            Authorization: token
        }
    });

    const result = await Result.json();
    return {
        isError: () => result.error == true,
        fullResult: result,
        ...result
    }
}

export async function GetGuildsWith(Id: string) {
    return CallAPI<APIGuild[]>(CreateRoute(Routes.GuildsWith) + `?id=${Id}`);
}

export async function GetChannels(Id: string): Promise<APIGuild[]> {
    const Result = await fetch(CreateRoute(Routes.Channels) + `?id=${Id}`, {
        method: Methods.Get,
        headers: {
            Authorization: token
        }
    });

    return Result.json();
}

export async function SendMessage(Id: string, ChannelId: string, Content: string): Promise<any> {
    console.log(token, process.env.NEXT_API_TOKEN)
    const Result = await fetch(CreateRoute(Routes.CreateMessage), {
        method: Methods.Post,
        body: JSON.stringify({
            id: Id,
            channel: ChannelId,
            content: Content,
            headers: {
                Authorization: token
            }
        })
    });

    return Result.json();
}
