import { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import { config } from "../../utils/config";
import { DeleteUser } from "../../utils/api";
// Get our environment variables
const { cookieName } = config;

export default async function Logout(_: NextApiRequest, res: NextApiResponse) {
	// remove cookie from request header
	res.setHeader("Set-Cookie", [
		serialize(cookieName, "", {
			maxAge: -1,
			path: "/",
		}),
	]);

	const token = parse(_.headers.cookie)[config.cookieName];
	await DeleteUser(token);

	res.writeHead(302, { Location: "/" });
	res.end();
};