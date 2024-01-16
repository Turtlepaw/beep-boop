/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { APIMessages } from "..";
import { Client } from "discord.js";

export default class Transcripts extends APIRoute {
    constructor() {
        super(Routes.Transcripts);
    }

    async Get(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, client: Client): Promise<any> {
        const ChannelId = req.params.id;
        if (ChannelId == null) return APIMessages.BadRequest(res, "id");

        const Ticket = await client.Storage.Tickets.Get({
            ChannelId
        });

        if (Ticket == null) return APIMessages.NotFound(res);
        return res.send(JSON.stringify(Array.from(Ticket.Messages.values()))).status(200);
    }
}