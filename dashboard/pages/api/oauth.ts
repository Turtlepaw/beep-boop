import fetch from "node-fetch";
import { serialize } from "cookie";
import { config } from "../../utils/config";
import { sign } from "jsonwebtoken";
import { DiscordUser } from "../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateUser } from "../../utils/api";

const scope = ["identify", "guilds"].join(" ");
const REDIRECT_URI = `${config.appUri}/api/oauth`;

const OAUTH_QS = new URLSearchParams({
  client_id: config.clientId,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope,
}).toString();

const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

export default async function OAuth(req: NextApiRequest, res: NextApiResponse) {
  console.log(config);
  if (req.method !== "GET") return res.redirect("/");

  const { code = null, error = null } = req.query;

  if (error) {
    return res.redirect(`/?error=${req.query.error}`);
  }

  if (!code || typeof code !== "string") return res.redirect(OAUTH_URI);

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code,
    scope,
  }).toString();

  const { access_token = null, token_type = "Bearer" } = (await fetch(
    "https://discord.com/api/oauth2/token",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body,
    }
  ).then((res) => res.json())) as any;

  if (!access_token || typeof access_token !== "string") {
    return res.redirect(OAUTH_URI);
  }

  const me: DiscordUser | { unauthorized: true } = (await fetch(
    "http://discord.com/api/users/@me",
    {
      headers: { Authorization: `${token_type} ${access_token}` },
    }
  ).then((res) => res.json())) as any;

  if (!("id" in me)) {
    console.log(me);
    return res.redirect(OAUTH_URI);
  }

  const token = sign(me, config.jwtSecret, { expiresIn: "1y" });

  //console.log(token);
  await CreateUser(token, {
    access_token,
    token_type,
    jwt_token: token,
  });

  res.setHeader(
    "Set-Cookie",
    serialize(config.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
    })
  );

  res.redirect("/");
}
