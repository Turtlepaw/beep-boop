import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Verifiers } from "@airdot/verifiers";
import { APIMessages } from "..";
import { Client } from "discord.js";

export default class Leaderboard extends APIRoute {
    constructor() {
        super(Routes.Leaderboard, {
            public: [Method.Get]
        });
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const guildId = req.params.id;

        const Leaderboard = await client.Levels.manager.FindBy({
            GuildId: guildId
        });

        res.send(Leaderboard ?? APIMessages.NotFound());
    }
}