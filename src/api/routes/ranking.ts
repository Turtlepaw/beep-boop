/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { APIMessages } from "..";
import { Client } from "discord.js";

export default class Ranking extends APIRoute {
    constructor() {
        super(Routes.Ranking, {
            public: [Method.Get]
        });
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const userId = req.params.id;

        const Ranking = await client.Levels.manager.Get({
            MemberId: userId
        });

        if (Ranking == null) return APIMessages.NotFound(res);
        res.send(Ranking);
    }
}