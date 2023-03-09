/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Client } from "discord.js";
import { Website } from "@config";
//import { APIMessages } from "../index";

export default class LinkedRolesRedirect extends APIRoute {
    constructor() {
        super(Routes.LinkedRoles, {
            public: [Method.Get]
        });
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const application = client.LinkedRoles;

        try {
            // Verifies if the cookie equals the one given on the /linked-role route
            const code = application.authorization.checkCookieAndReturnCode(req, res);
            // Invalid Cookie
            if (!code) return res.sendStatus(403);

            // Gets the user and stores the tokens
            const data = await application.authorization.getUserAndStoreToken(code);
            if (!application.authorization.checkRequiredScopesPresent(data.scopes)) return res.redirect('/linked-role');
            const user = data.user;

            // const advancedUser = await application.fetchUser(user.id); , User with email, verified ...

            // Set Application MetaData
            application.setUserMetaData(user.id, user.username, {
                //@ts-expect-error typings...
                verified: true
            });

            res.redirect(`${Website}/link/success`);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
}