import { ChannelType, Client, PermissionFlagsBits, TextChannel, User } from "discord.js";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { DEVELOPER_BUILD } from "../index";
import https from "https";
import fs from "fs";
import { Verifiers } from "@airdot/verifiers";
import {
    Routes,
    APIChannel,
    APIGuild,
    OAuthUser
} from "./api-types";
import APIRoute, { Method } from "../lib/APIRoute";
import KlawSync from "klaw-sync";
import { BaseDirectory } from "../configuration";

export const APIMessages = {
    NotFound: () => ({
        error: true,
        message: "Item not found",
        code: 404
    }),
    InternalError: () => ({
        error: true,
        message: "Internal Server Error",
        code: 500
    }),
    BadRequest: (param?: string) => ({
        error: true,
        message: `Bad Request${param != null ? ` (${param})` : ""}`,
        code: 400
    }),
    Success: (message?: string, more?: object) => ({
        ...more,
        error: false,
        message: message ?? "Success",
        code: 200
    }),
    Created: (message?: string, more?: object) => ({
        ...more,
        error: false,
        message: message ?? "Created",
        code: 201
    })
}

function VerifyBase(str: any) {
    return (str == null);
}

function VerifyString(str: any): str is string {
    return VerifyBase(str) || (str != typeof String) || (str.length <= 0);
}

function VerifyNumber(str: any, length?: number): str is number {
    if (isNaN(str)) str = Number(str);
    if (length != null && str.length != length) return true;
    return VerifyBase(str) || (isNaN(str));
}

function StringNumber(str: any, length?: number): str is number {
    if (isNaN(str)) str = Number(str);
    if (length != null && str.length != length) return false;
    return !isNaN(str);
}

function VerifyStringNumber(str: any, length?: number): str is string {
    if (isNaN(str)) str = Number(str);
    if (length != null && str.length != length) return true;
    return VerifyBase(str) || (isNaN(str));
}

export async function API(client: Client, token: string) {
    function verifyAuthentication(testWith: string) {
        return testWith === token;
    }

    const app = express();

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const APIRoutes: APIRoute[] = [];
    const APIRouteFiles = KlawSync(`${BaseDirectory}/api/routes`, { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
    for (const File of APIRouteFiles) {
        const RequiredFile = require(File.path);
        const route: APIRoute = new RequiredFile.default();

        async function handleAuth(req: Request, res: Response, type: Method) {
            if (route?.public == null || !route?.public?.includes(type)) {
                const auth = req.headers.authorization;
                if (!verifyAuthentication(auth)) {
                    res.status(401).send('Unauthorized');
                    return false;
                } else return true;
            } else return true;
        }

        if (route.Get != null) app.get(route.route, async (req, res) => {
            if (!await handleAuth(req, res, Method.Get)) return;
            await route.Get(req, res, client);
        });
        if (route.Post != null) app.post(route.route, async (req, res) => {
            if (!await handleAuth(req, res, Method.Post)) return;
            await route.Post(req, res, client);
        });

        APIRoutes.push(route);
    }

    //authentication with app.use
    app.use((req, res, next) => {
        if (APIRoutes.map(e => e.route.replaceAll(/\/:\w+/ig, "")).includes(req.path as Routes)) next();
        const auth = req.headers.authorization;
        if (verifyAuthentication(auth)) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    });

    console.log(`${`Loaded`.gray} ${`${APIRoutes.length}`.green.bold} ${`API Routes`.gray}`)

    app.get(Routes.Index, async (req, res) => {
        res.send(
            APIMessages.Success("Server online, waiting for requests...")
        );
    });

    app.get(Routes.OAuth, async (req, res) => {
        const UserId = req.query?.id as string;
        if (!Verifiers.String(UserId)) return res.send(
            APIMessages.BadRequest("id")
        );

        const User = client.Storage.OAuth.FindBy({ User: UserId });
        res.send(User[0]);
    });

    app.post(Routes.OAuth, async (req, res) => {
        const UserId = req.body?.id;
        const access_token = req.body?.access_token;
        const token_type = req.body?.token_type;
        const jwt_token = req.body?.jwt_token;

        if (VerifyNumber(UserId, 18)) return res.send(
            APIMessages.BadRequest("id")
        );

        if (
            !Verifiers.String(access_token) ||
            !Verifiers.String(token_type) ||
            !Verifiers.String(jwt_token)
        ) return res.send(
            APIMessages.BadRequest("missing 1 or more params")
        );

        client.Storage.OAuth.Create({
            User: UserId,
            token_type,
            jwt_token,
            access_token
        });

        res.send(
            APIMessages.Created()
        );
    });

    app.delete(Routes.OAuth, async (req, res) => {
        const UserId = req.body?.id;

        if (VerifyNumber(UserId, 18)) return res.send(
            APIMessages.BadRequest("id")
        );

        delete client.storage[`oauth_${UserId}`];
        res.send(
            APIMessages.Created()
        );
    });

    app.get(Routes.GuildsWith, async (req, res) => {
        const UserId = req.query?.id;

        if (typeof UserId != "string" || VerifyStringNumber(UserId, 18)) return res.send(
            APIMessages.BadRequest("id")
        );

        const Guilds: APIGuild[] = client.guilds.cache.filter(async e => {
            try {
                const Members = await e.members.fetch().catch(() => { });
                //@ts-expect-error
                if (!Members.has(UserId)) return;
                //@ts-expect-error
                const Member = Members.get(UserId);
                return Member.permissions.has(PermissionFlagsBits.ManageGuild);
            } catch (e) {

            }
        }).map(e => ({
            Features: e.features,
            IconHash: e.icon,
            IconURL: e.iconURL({ forceStatic: true }),
            Id: e.id,
            IsOwner: e.ownerId == UserId,
            Name: e.name,
            Permissions: e.members.cache.get(UserId).permissions.toArray()
        }));

        res.send(Guilds);
    });

    app.get(Routes.Channels, async (req, res) => {
        const GuildId = req.query?.id;
        if (VerifyStringNumber(GuildId, 19)) return res.send(
            APIMessages.BadRequest("id")
        );

        //@ts-expect-error
        const Guild = await client.guilds.fetch(GuildId);

        if (Guild == null) return res.send(
            APIMessages.NotFound()
        );

        const Channels: APIChannel[] = Guild.channels.cache.filter(e => e.type == ChannelType.GuildText).map(e => ({
            Id: e.id,
            Name: e.name
        }));

        res.send(Channels);
    });

    app.post(Routes.CreateMessage, async (req, res) => {
        const GuildId = req.body?.id;
        const ChannelId = req.body?.channel;
        const MessageContent = req.body?.content;

        if (VerifyStringNumber(GuildId, 19)) return res.send(
            APIMessages.BadRequest("id")
        );

        if (VerifyStringNumber(ChannelId, 19)) return res.send(
            APIMessages.BadRequest("channel")
        );

        if (!Verifiers.String(MessageContent)) return res.send(
            APIMessages.BadRequest("content")
        );

        const Guild = await client.guilds.fetch(GuildId);
        const Channel = await Guild.channels.fetch(ChannelId);

        (Channel as TextChannel).send({
            content: MessageContent
        });

        res.send(
            APIMessages.Created()
        );
    });

    app.get(Routes.Subscription, async (req, res) => {
        const GuildId = req.params.guildId;

        if (VerifyStringNumber(GuildId, 19)) return res.send(
            APIMessages.BadRequest("guildId")
        );

        const Guild = await client.Storage.Configuration.forGuild({
            id: GuildId,
            name: "Unknown Guild"
        });

        res.send(Guild?.Premium ?? false);
    });

    //app.listen(4000, () => console.log("API Ready".green, "http://localhost:4000/".gray))
    var privateKey = fs.readFileSync('server.key');
    var certificate = fs.readFileSync('server.cert');

    const port = DEVELOPER_BUILD ? 4000 : 443;

    if (DEVELOPER_BUILD) {
        app.listen(port, () => console.log("API Running: ".green + "http://localhost:4000/".gray));
    } else {
        https.createServer({
            key: privateKey,
            cert: certificate
        }, app).listen(port, () => console.log("API Running: ".green + "https://api.trtle.xyz/".gray));
    }
}