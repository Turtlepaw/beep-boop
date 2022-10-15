import { EmbedBuilder } from "@discordjs/builders";
import * as dotenv from 'dotenv';
dotenv.config()

export const token = process.env.TOKEN || "";
export const clientId = process.env.CLIENT_ID || "1028785995337977856";
export const guildId = "1028789308401918004";
export const color = "#FF6060";

export class Embed extends EmbedBuilder {
    constructor() {
        super();
        this.setColor([255, 96, 96])
    }

    build() {
        return [this]
    }
}