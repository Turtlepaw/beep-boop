import { config } from "./config";

export function GenerateInviteURL() {
    return `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`;
}