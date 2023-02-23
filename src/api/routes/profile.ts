/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "discord.js";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { APIMessages } from "..";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";

export default class Profile extends APIRoute {
    constructor() {
        super(Routes.Profile, {
            public: [Method.Get]
        });
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const userId = req.params.id;

        const Profile = await client.Storage.Profiles.Get({
            userId
        }) as any;

        if (Profile == null) return APIMessages.NotFound(res);
        Profile.guilds = Array.from(Profile.guilds.values()) as any;
        Profile.expiresMilliseconds = new Date(Profile.expires).getTime();
        Profile.expiresTimestamp = new Date(Profile.expires).getTime() / 1000;

        return res.send(Profile).status(200);
    }
}