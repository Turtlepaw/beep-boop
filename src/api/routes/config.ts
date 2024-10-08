/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Verifiers } from "@airdot/verifiers";
import { APIMessages } from "..";
import { Client } from "discord.js";

export default class Configuration extends APIRoute {
    constructor() {
        super(Routes.GuildConfiguration, {
            method: Method.Get
        });
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const GuildId = req.params.guildId;

        if (!Verifiers.Discord.Snowflake(GuildId)) return APIMessages.BadRequest(res, "guildId")

        const Settings = await client.Storage.Configuration.forGuild({
            name: "Unknown Guild",
            id: GuildId
        });

        if (Settings == null) return APIMessages.NotFound(res);
        return res.send(Settings);
    }
}