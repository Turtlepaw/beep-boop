import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { AllMethods, Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Verifiers } from "@airdot/verifiers";
import { APIMessages } from "..";
import { Client } from "discord.js";

export default class Profile extends APIRoute {
    constructor() {
        super(Routes.Profile, {
            public: [Method.Get]
        });
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const userId = req.params.id;

        let Profile = await client.Storage.Profiles.Get({
            userId
        }) as any;

        Profile.guilds = Array.from(Profile.guilds.values()) as any;
        Profile.expiresMilliseconds = new Date(Profile.expires).getTime();
        Profile.expiresTimestamp = new Date(Profile.expires).getTime() / 1000;

        res.send(Profile ?? APIMessages.NotFound());
    }
}