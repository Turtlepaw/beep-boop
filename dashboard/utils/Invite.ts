import { config } from "./config";
import { Configuration } from "./configuration";
export function GenerateInviteURL(redirect?: boolean) {
    return `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands${redirect ? `&redirect_uri=${encodeURI(config.appUri + "/dashboard")}` : ""}`;
}