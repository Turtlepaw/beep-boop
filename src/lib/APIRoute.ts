import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, ButtonInteraction, Client, CommandInteraction, PermissionResolvable, PermissionsString } from "discord.js";
import { Routes } from "../api/api-types";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export enum Method {
    Get = "get",
    Post = "post",
    Put = "put"
}

export const AllMethods = [Method.Get, Method.Post, Method.Put];

export type APIRouteBuilderOptions = {
    /**
     * If the API route is availble for public use.
     */
    public?: Method[];
    /**
     * @deprecated use `Get`, `Post` or `Put` instead
     */
    method?: Method;
}

export default class APIRoute {
    public public: Method[] = [];
    public route: Routes;
    //public method: Method = Method.Get;

    constructor(route: Routes, options: APIRouteBuilderOptions = {}) {
        this.public = options?.public;
        // this.method = options?.method;
        this.route = route;
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> { };
    async Post(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> { };
    async Put(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> { };
}