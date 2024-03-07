import { GetServerSidePropsContext } from "next";
import {
  DiscordGuild,
  DiscordUser,
  DiscordUserPartial,
  RawDiscordGuild,
  rawDiscordUser,
} from "./types";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import { config } from "./config";
import fetch from "node-fetch";
import { GetGuildsWith, GetUser } from "./api";

export interface ParseError {
  error: boolean;
  message: string;
}

export function parseGuild(
  guild: RawDiscordGuild,
  fetchedGuild: RawDiscordGuild
): DiscordGuild {
  //If you have the API running change this from:
  //const botIn = fetchedGuild == null;
  //to this:
  //const botIn = fetchedGuild != null;
  const botIn = fetchedGuild == null;

  return {
    features: guild.features,
    icon: guild.icon,
    iconURL:
      guild.icon == null
        ? null
        : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`,
    id: guild.id,
    name: guild.name,
    owner: guild.owner,
    permissions: guild.permissions,
    botIn: botIn,
  };
}

export async function parseUserFromAPI(
  ctx: GetServerSidePropsContext,
  fetched: rawDiscordUser
): Promise<DiscordUserPartial> {
  return {
    ...fetched,
    tag: `${fetched.username}#${fetched.discriminator}`,
    avatarURL: `https://cdn.discordapp.com/avatars/${fetched.id}/${fetched.avatar}.png?size=4096`,
    bannerURL: `https://cdn.discordapp.com/banners/${fetched.id}/${fetched.banner}.png?size=4096`,
  };
}

export async function parseUser(
  ctx: GetServerSidePropsContext,
  getGuilds: boolean = false
): Promise<DiscordUser | null> {
  if (!ctx.req.headers.cookie) {
    return null;
  }

  const token = parse(ctx.req.headers.cookie)[config.cookieName];

  if (!token) {
    console.log("No token");
    return null;
  }

  let User: DiscordUser;

  try {
    let { iat, exp, ...user } = verify(
      token,
      config.jwtSecret
    ) as DiscordUser & { iat: number; exp: number };

    User = {
      ...user,
      avatarURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`,
      guilds: null,
    };
  } catch (e) {
    console.log(e);
    return null;
  }

  let parsedGuilds = null;

  if (getGuilds) {
    console.warn(
      "The getGuilds paramater is deprecated, fetch the guilds with SWR instead"
    );
    const Guilds = await GetGuildsWith(User.id);
    User.guilds = Guilds.fullResult;
    // const raw = await GetUser(token);

    // const guilds: RawDiscordGuild[] = await fetch("http://discord.com/api/users/@me/guilds", {
    //     headers: { Authorization: `${raw.token_type} ${raw.access_token}` },
    // }).then((res: any) => res.json());

    // const allGuilds: RawDiscordGuild[] = [];
    // // const allGuilds: RawDiscordGuild[] = await fetch(`http://discord.com/api/guilds`, {
    // //   headers: {
    // //     Authorization: `Bot ${config.botToken}`
    // //   }
    // // }).then((res) => res.json());

    // if (!guilds || !Array.isArray(guilds)) return null;

    // console.log(allGuilds)
    // const rawGuilds = guilds.map(e => {
    //     const guildFromAll = allGuilds.find(e => e.id == e.id);
    //     if (guildFromAll == undefined) return;
    //     const base = parseGuild(e, guildFromAll);
    //     if (base.permissions && 0x0000000000000008 != 8) return;
    //     return base;
    // });

    // parsedGuilds = rawGuilds.filter(e => e != undefined);
  }

  return User;
}

export enum Errors {
  NotLoggedIn = "NOT_LOGGED_IN",
  NotFound = "NOT_FOUND",
}

export interface DefaultProps {
  user?: DiscordUser | null;
  mobile: boolean;
  error?: Errors;
}

export interface DeprecatedDefaultProps {
  user?: DiscordUser | null;
  mobile?: boolean;
  error?: Errors;
}

export interface ConfigProps {
  apiUri: string;
  privateKey: string;
}
