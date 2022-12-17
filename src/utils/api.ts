import { ChannelType, Client, PermissionFlagsBits, TextChannel, User } from "discord.js";
import express from "express";
import bodyParser from "body-parser";
import { CLIENT_ID, TOKEN } from "../index";
import fetch from "node-fetch";

export enum Routes {
    AppealSettings = "/settings/appeals",
    TicketSettings = "/settings/tickets",
    Index = "/",
    OAuth = "/oauth",
    GuildsWith = "/guilds",
    Channels = "/channels",
    CreateMessage = "/message/create",
    RoleConnections = "/role-connections/verify"
}

enum Status {
    Initialized = 1,
    Error = 2,
    Success = 3,
    NotFound = 4
}

enum Messages {
    Initialized = 'SERVER_INITIALIZED_AND_READY',
    Error = 'SERVER_ERROR',
    Success = 'SERVER_SUCCESS',
    NotFound = 'NOT_FOUND_ON_SERVER'
}

const GetMessage = (Message: Messages | string) => {
    return {
        error: Message == Messages.Error || Message == Messages.NotFound,
        message: Message
    }
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
    //Permissions: any;
    Features: any[];
}

export interface APIChannel {
    Id: string;
    Name: string;
}

export function Message(Message: Messages, Text: string) {
    return `[${Message}] ${Text}`;
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

    app.get(Routes.AppealSettings, async (req, res) => {
        const GuildId = req.query.id;

        if (VerifyNumber(GuildId, 19)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Guild Id")
        ));

        const Settings = client.storage[`${GuildId}_appeal_channel`];
        res.send(Settings);
    });

    app.post(Routes.AppealSettings, async (req, res) => {
        const GuildId = req.body?.id;
        const Channel = req.body?.channel;

        if (VerifyNumber(Channel, 19)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Channel Id")
        ));

        if (VerifyNumber(GuildId, 18)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Guild Id")
        ));

        client.storage[`${GuildId}_appeal_channel`] = Channel;
        res.send(Messages.Success);
    });

    app.get(Routes.TicketSettings, async (req, res) => {
        const GuildId = req.query.id;

        if (VerifyNumber(GuildId, 19)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Guild Id")
        ));

        const Settings = client.storage[`${GuildId}_tickets`];
        res.send(Settings);
    });

    app.post(Routes.TicketSettings, async (req, res) => {
        const GuildId = req.body?.id;
        const Channel = req.body?.channel;

        if (VerifyNumber(Channel, 19)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Channel Id")
        ));

        if (VerifyNumber(GuildId, 18)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Guild Id")
        ));

        client.storage[`${GuildId}_tickets`] = Channel;
        res.send(Messages.Success);
    });

    app.get(Routes.Index, async (req, res) => {
        res.send(Messages.Initialized);
    });

    app.get(Routes.OAuth, async (req, res) => {
        const UserId = req.query?.id;
        if (VerifyString(UserId)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Id")
        ));

        const User = client.storage[`oauth_${UserId}`];
        res.send(User);
    });

    app.post(Routes.OAuth, async (req, res) => {
        const UserId = req.body?.id;
        const access_token = req.body?.access_token;
        const token_type = req.body?.token_type;
        const jwt_token = req.body?.jwt_token;

        if (VerifyNumber(UserId, 18)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid User Id")
        ));

        if (
            VerifyString(access_token) ||
            VerifyString(token_type) ||
            VerifyString(jwt_token)
        ) return res.send(GetMessage(
            Message(Messages.Error, "Missing a parameter")
        ));

        client.storage[`oauth_${UserId}`] = {
            access_token,
            token_type,
            jwt_token
        };

        res.send(
            GetMessage(Messages.Success)
        );
    });

    app.delete(Routes.OAuth, async (req, res) => {
        const UserId = req.body?.id;

        if (VerifyNumber(UserId, 18)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid User Id")
        ));

        delete client.storage[`oauth_${UserId}`];
        res.send(
            GetMessage(Messages.Success)
        );
    });

    app.get(Routes.GuildsWith, async (req, res) => {
        const UserId = req.query?.id;

        if (VerifyStringNumber(UserId, 18)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid User Id")
        ));

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
            //@ts-expect-error
            IsOwner: e.ownerId == UserId,
            Name: e.name
        }));

        res.send(Guilds);
    });

    app.get(Routes.Channels, async (req, res) => {
        const GuildId = req.query?.id;
        if (VerifyStringNumber(GuildId, 19)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Guild Id")
        ));

        //@ts-expect-error
        const Guild = await client.guilds.fetch(GuildId);

        if (Guild == null) return res.send(GetMessage(
            Message(Messages.Error, "Cannot find guild")
        ));

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

        if (VerifyStringNumber(GuildId, 19)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Guild Id")
        ));

        if (VerifyStringNumber(ChannelId, 19)) return res.send(GetMessage(
            Message(Messages.Error, "Invalid Channel Id")
        ));

        const Guild = await client.guilds.fetch(GuildId);
        const Channel = await Guild.channels.fetch(ChannelId);

        (Channel as TextChannel).send({
            content: MessageContent
        });

        res.send(Messages.Success);
    })

    async function RegisterApp() {
        /**
         * Copied From: https://discord.com/developers/docs/tutorials/configuring-app-metadata-for-linked-roles
         * Register the metadata to be stored by Discord. This should be a one time action.
         * Note: uses a Bot token for authentication, not a user token.
         */
        const url = `https://discord.com/api/v10/applications/${CLIENT_ID}/role-connections/metadata`;
        // supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7
        const body = [
            {
                key: 'cookieseaten',
                name: 'Cookies Eaten',
                description: 'Cookies Eaten Greater Than',
                type: 2,
            },
            {
                key: 'allergictonuts',
                name: 'Allergic To Nuts',
                description: 'Is Allergic To Nuts',
                type: 7,
            },
            {
                key: 'bakingsince',
                name: 'Baking Since',
                description: 'Days since baking their first cookie',
                type: 6,
            },
        ];

        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${TOKEN}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("ok", data);
        } else {
            throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}`);
            const data = await response.text();
            console.log(data);
        }
    }

    //RegisterApp();

    app.listen(4000, () => console.log("API Ready".green, "https://localhost:4000/".gray))
}