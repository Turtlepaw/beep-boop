import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Verifiers } from "@airdot/verifiers";
import { APIMessages } from "..";
import { Client } from "discord.js";
import { GenerateToken } from "../../utils/Id";

export default class ApiUsers extends APIRoute {
    constructor() {
        super(Routes.ApiUser);
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const UserId = req.params.id;
        if (UserId == null) return res.send(APIMessages.BadRequest("id"));

        const User = await client.Storage.ApiUsers.Get({
            User: UserId
        });

        res.send(User ?? APIMessages.NotFound());
    }

    async Post(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client<boolean>): Promise<any> {
        const UserId = req.params.id;
        if (UserId == null) return res.send(APIMessages.BadRequest("id"));

        const User = await client.Storage.ApiUsers.Create({
            User: UserId,
            Token: GenerateToken()
        });

        res.send(User ?? APIMessages.InternalError());
    }
}