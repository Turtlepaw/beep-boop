/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { APIMessages } from "..";
import { Client } from "discord.js";

export default class Modules extends APIRoute {
    constructor() {
        super(Routes.Modules);
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const ModuleId = req.params.id;

        if (ModuleId == "all") {
            const Modules = await client.Storage.Actions.FindBy({
                Approved: true
            });

            if (Modules == null) return APIMessages.NotFound(res);
            return res.send(Modules).status(200);
        } else {
            const Module = await client.Storage.Actions.Get({
                Id: ModuleId
            });

            if (Module == null) return APIMessages.NotFound(res);
            res.send(Module).status(200);
        }
    }
}