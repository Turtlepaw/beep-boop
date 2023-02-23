/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { APIMessages } from "..";
import { Client } from "discord.js";
import { Logger } from "../../logger";

export default class Module extends APIRoute {
    constructor() {
        super(Routes.Module);
    }

    async Post(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const data = req.body;

        let Module;

        try {
            Module == await client.Storage.Actions.Create({
                ...data
            });
        } catch (e) {
            Logger.error(`API Error (creating module): ${e}`);
        }

        if (Module == null) return APIMessages.InternalError(res);

        res.send(APIMessages.Created(null, undefined, { data: Module })).status(200);
    }
}