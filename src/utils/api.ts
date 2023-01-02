import { ChannelType, Client, PermissionFlagsBits, TextChannel, User } from "discord.js";
import express from "express";
import bodyParser from "body-parser";
import { CLIENT_ID, DEVELOPER_BUILD, TOKEN } from "../index";
import fetch from "node-fetch";
import https from "https";
import fs from "fs";
import { Verifiers } from "@airdot/verifiers";
//import { Routes } from "../../shared/types";

export enum Routes {
    GuildConfiguration = "/v1/settings/:guildId",
    Index = "/v1/",
    OAuth = "/v1/oauth",
    GuildsWith = "/v1/guilds",
    Channels = "/v1/channels",
    CreateMessage = "/v1/message/create",
    RoleConnections = "/v1/role-connections/verify",
    Subscription = "/v1/subscription/:guildId",
    //Module store
    Module = "/v1/modules"
}

export interface OAuthUser {
    access_token: string;
    token_type: string;
    jwt_token: string;
}

export interface APIGuild {
    Id: string;
    Name: string;
    IconHash: string | null;
    IconURL: string | null;
    IsOwner: boolean; //if they are the owner
    Permissions: string[];
    Features: any[];
}

export interface APIChannel {
    Id: string;
    Name: string;
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

    //authentication with app.use
    app.use((req, res, next) => {
        const auth = req.headers.authorization;
        if (verifyAuthentication(auth)) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const APIMessages = {
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

    app.get(Routes.GuildConfiguration, async (req, res) => {
        const GuildId = req.params.guildId;

        if (!StringNumber(GuildId, 19)) return res.send(
            APIMessages.BadRequest("guildId")
        );

        const Settings = await client.Storage.Configuration.forGuild({
            name: "Unknown Guild",
            id: GuildId
        });

        res.send(Settings ?? APIMessages.NotFound());
    });

    app.get(`${Routes.Module}/:id`, async (req, res) => {
        const ModuleId = req.params.id;

        const Module = await client.Storage.Actions.Get({
            Id: ModuleId
        });

        res.send(Module ?? APIMessages.InternalError());
    });

    app.post(Routes.Module, async (req, res) => {
        const Module = await client.Storage.Actions.Create({
            ...req.body
        });

        res.send(Module ?? APIMessages.NotFound());
    });

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