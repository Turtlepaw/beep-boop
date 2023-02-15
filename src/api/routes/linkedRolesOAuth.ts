/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Client } from "discord.js";
//import { APIMessages } from "../index";

export default class LinkedRolesOAuth extends APIRoute {
    constructor() {
        super(Routes.LinkedRolesOAuth, {
            public: [Method.Get]
        });
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        return await client.LinkedRoles.authorization.setCookieAndRedirect(req, res);
    }
}