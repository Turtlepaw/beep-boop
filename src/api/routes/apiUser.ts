/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { APIMessages } from "..";
import { Client } from "discord.js";
import { GenerateToken } from "../../utils/Id";
import { Logger } from "../../logger";

export default class ApiUsers extends APIRoute {
    constructor() {
        super(Routes.ApiUser);
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const UserId = req.params.id;
        if (UserId == null) return APIMessages.BadRequest(res, "id");

        const User = await client.Storage.ApiUsers.Get({
            User: UserId
        });

        if (User == null) APIMessages.NotFound(res);

        return res.send(User).status(200);
    }

    async Post(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client<boolean>): Promise<any> {
        const UserId = req.params.id;
        if (UserId == null) return APIMessages.BadRequest(res, "id");

        let User;
        try {
            User = await client.Storage.ApiUsers.Create({
                User: UserId,
                Token: GenerateToken()
            });
        } catch (e) {
            Logger.error(`API Error (creating user): ${e}`);
        }

        if (User == null) return APIMessages.InternalError(res);
        res.send(User);
    }
}