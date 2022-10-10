import { EmbedBuilder } from "@discordjs/builders";

export const token = process.env.TOKEN || "";
export const clientId = process.env.CLIENT_ID || "";
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