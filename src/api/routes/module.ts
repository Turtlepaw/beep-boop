import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Verifiers } from "@airdot/verifiers";
import { APIMessages } from "..";
import { Client } from "discord.js";

export default class Module extends APIRoute {
    constructor() {
        super(Routes.Module);
    }

    async Post(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const data = req.body;

        const Module = await client.Storage.Actions.Create({
            ...data
        });

        res.send(APIMessages.Created(null, { data: Module }) ?? APIMessages.InternalError());
    }
}