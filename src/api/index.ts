/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ChannelType,
  Client,
  Collection,
  GuildMember,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { API_PORT, API_URL, USE_SSL } from "../index";
import https from "https";
import fs from "fs";
import { Verifiers } from "@airdot/verifiers";
import { Routes, APIChannel, APIGuild } from "./api-types";
import APIRoute, { Method } from "../lib/APIRoute";
import KlawSync from "klaw-sync";
import { BaseDirectory } from "../configuration";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cors from "cors";

export const APIMessages = {
  NotFound: (res: Response) => {
    return res
      .send({
        error: true,
        message: "Item not found",
        code: 404,
      })
      .status(404);
  },
  InternalError: (res: Response) => {
    return res
      .send({
        error: true,
        message: "Internal Server Error",
        code: 500,
      })
      .status(500);
  },
  BadRequest: (res: Response, param?: string) => {
    return res
      .send({
        error: true,
        message: `Bad Request${param != null ? ` (${param})` : ""}`,
        code: 400,
      })
      .status(400);
  },
  Success: (res: Response, message?: string, more?: object) => {
    return res
      .send({
        ...more,
        error: false,
        message: message ?? "Success",
        code: 200,
      })
      .status(200);
  },
  Created: (res: Response, message?: string, more?: object) => {
    return res
      .send({
        ...more,
        error: false,
        message: message ?? "Created",
        code: 201,
      })
      .status(201);
  },
};

function VerifyBase(str: unknown) {
  return str == null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VerifyNumber(str: any, length?: number): str is number {
  if (isNaN(str)) str = Number(str);
  if (length != null && str.length != length) return true;
  return VerifyBase(str) || isNaN(str);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VerifyStringNumber(str: any, length?: number): str is string {
  if (isNaN(str)) str = Number(str);
  if (length != null && str.length != length) return true;
  return VerifyBase(str) || isNaN(str);
}

export async function API(client: Client, token: string) {
  function verifyAuthentication(testWith: string) {
    return testWith === token;
  }

  const app = express();

  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser(crypto.randomUUID()));

  const APIRoutes: APIRoute[] = [];
  const APIRouteFiles = KlawSync(`${BaseDirectory}/api/routes`, {
    nodir: true,
    traverseAll: true,
    filter: (f) => f.path.endsWith(".js"),
  });
  for (const File of APIRouteFiles) {
    const RequiredFile = require(File.path);
    const route: APIRoute = new RequiredFile.default();

    // eslint-disable-next-line no-inner-declarations
    async function handleAuth(req: Request, res: Response, type: Method) {
      if (route?.public == null || !route?.public?.includes(type)) {
        const auth = req.headers.authorization;
        if (!verifyAuthentication(auth)) {
          console.log(`Unauthorized user at ${route.route} (${type})`.yellow);
          res.status(401).send("Unauthorized");
          return false;
        } else return true;
      } else return true;
    }

    if (route.Get != null)
      app.get(route.route, async (req, res) => {
        if (!(await handleAuth(req, res, Method.Get))) return;
        await route.Get(req, res, client);
      });
    if (route.Post != null)
      app.post(route.route, async (req, res) => {
        if (!(await handleAuth(req, res, Method.Post))) return;
        await route.Post(req, res, client);
      });

    APIRoutes.push(route);
  }

  //authentication with app.use
  app.use((req, res, next) => {
    if (
      APIRoutes.map((e) =>
        Array.isArray(e.route)
          ? e.route.map((e) => e.replaceAll(/\/:\w+/gi, ""))
          : e.route.replaceAll(/\/:\w+/gi, "")
      ).includes(req.path as Routes)
    )
      return next();
    const auth = req.headers.authorization;
    if (verifyAuthentication(auth)) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  });

  console.log(
    `${`Loaded`.gray} ${`${APIRoutes.length}`.green.bold} ${`API Routes`.gray} `
  );

  app.get(Routes.Index, async (req, res) => {
    APIMessages.Success(res, "Server online, waiting for requests...");
  });

  app.get(Routes.OAuth, async (req, res) => {
    const UserId = req.query?.id as string;
    if (!Verifiers.String(UserId)) return APIMessages.BadRequest(res, "id");

    const User = client.Storage.OAuth.FindBy({ User: UserId });
    res.send(User[0]);
  });

  app.post(Routes.OAuth, async (req, res) => {
    const UserId = req.body?.id;
    const access_token = req.body?.access_token;
    const token_type = req.body?.token_type;
    const jwt_token = req.body?.jwt_token;

    if (VerifyNumber(UserId, 18)) return APIMessages.BadRequest(res, "id");

    if (
      !Verifiers.String(access_token) ||
      !Verifiers.String(token_type) ||
      !Verifiers.String(jwt_token)
    )
      return APIMessages.BadRequest(res, "missing 1 or more params");

    client.Storage.OAuth.Create({
      User: UserId,
      token_type,
      jwt_token,
      access_token,
    });

    return APIMessages.Created(res);
  });

  app.delete(Routes.OAuth, async (req, res) => {
    const UserId = req.body?.id;

    if (VerifyNumber(UserId, 18)) return APIMessages.BadRequest(res, "id");

    delete client.storage[`oauth_${UserId} `];
    return APIMessages.Created(res);
  });

  app.get(Routes.GuildsWith, async (req, res) => {
    const UserId = req.query?.id;

    if (typeof UserId != "string" || VerifyStringNumber(UserId, 18))
      return APIMessages.BadRequest(res, "id");

    const Guilds: APIGuild[] = client.guilds.cache
      .filter(async (e) => {
        try {
          const Members = (await e.members
            .fetch()
            .catch(() => null)) as Collection<string, GuildMember>;
          if (!Members.has(UserId)) return;
          const Member = Members.get(UserId);
          return Member.permissions.has(PermissionFlagsBits.ManageGuild);
        } catch (e) {
          return null;
        }
      })
      .map((e) => ({
        Features: e.features,
        IconHash: e.icon,
        IconURL: e.iconURL({ forceStatic: true }),
        Id: e.id,
        IsOwner: e.ownerId == UserId,
        Name: e.name,
        Permissions: e.members.cache.get(UserId).permissions.toArray(),
      }));

    return res.send(Guilds).status(200);
  });

  app.get(Routes.Channels, async (req, res) => {
    const GuildId = req.query?.id;
    if (VerifyStringNumber(GuildId, 19))
      return APIMessages.BadRequest(res, "id");

    //@ts-expect-error its an id
    const Guild = await client.guilds.fetch(GuildId);

    if (Guild == null) return APIMessages.NotFound(res);

    const Channels: APIChannel[] = Guild.channels.cache
      .filter((e) => e.type == ChannelType.GuildText)
      .map((e) => ({
        Id: e.id,
        Name: e.name,
      }));

    return res.send(Channels).status(200);
  });

  app.post(Routes.CreateMessage, async (req, res) => {
    const GuildId = req.body?.id;
    const ChannelId = req.body?.channel;
    const MessageContent = req.body?.content;

    if (VerifyStringNumber(GuildId, 19))
      return APIMessages.BadRequest(res, "id");

    if (VerifyStringNumber(ChannelId, 19))
      return APIMessages.BadRequest(res, "channel");

    if (!Verifiers.String(MessageContent))
      return APIMessages.BadRequest(res, "content");

    const Guild = await client.guilds.fetch(GuildId);
    const Channel = await Guild.channels.fetch(ChannelId);

    (Channel as TextChannel).send({
      content: MessageContent,
    });

    return APIMessages.Created(res);
  });

  app.get(Routes.Subscription, async (req, res) => {
    const GuildId = req.params.guildId;

    if (VerifyStringNumber(GuildId, 19))
      return APIMessages.BadRequest(res, "guildId");

    const Guild = await client.Storage.Configuration.forGuild({
      id: GuildId,
      name: "Unknown Guild",
    });

    res.send(Guild?.Premium ?? false).status(200);
  });

  //app.listen(4000, () => console.log("API Ready".green, "http://localhost:4000/".gray))

  const port = API_PORT; //DEVELOPER_BUILD ? 4000 : 443;
  const uri = API_URL;
  if (isNaN(port)) throw new Error("API_PORT must be a valid number");
  if (uri == null || typeof uri != "string")
    throw new Error("API_URL must be a valid string");
  const onListen = () => console.log("API Running: ".green + `${uri} `.gray);
  if (!USE_SSL) {
    app.listen(port, onListen);
  } else {
    const privateKey = fs.readFileSync("server.key");
    const certificate = fs.readFileSync("server.cert");
    https
      .createServer(
        {
          key: privateKey,
          cert: certificate,
        },
        app
      )
      .listen(port, onListen);
  }
}
