import { EmbedBuilder } from "@discordjs/builders";
const { Token, ClientId } = requireConfigJSON();

function requireConfigJSON() {
    try {
        const { token: Token, clientId: ClientId } = require("./config.json");
        return {
            Token,
            ClientId
        }
    } catch (e) {
        return {
            Token: "aa",
            ClientId: "aa"
        }
    }
}

export const token = process.env.TOKEN || Token;
export const clientId = process.env.CLIENT_ID || ClientId;
export const guildId = "1028789308401918004";
export const color = "#FF6060";
export enum Emojis {
    TextChannel = "<:ChannelText:1034911639243345960>",
    Tada = "<a:tada:1034912799853383731>"
}

export class Embed extends EmbedBuilder {
    constructor() {
        super();
        this.setColor([255, 96, 96])
    }

    build() {
        return [this]
    }
}