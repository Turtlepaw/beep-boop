import { EmbedBuilder } from "@discordjs/builders";

//export const token = process.env.TOKEN;
//export const clientId = process.env.CLIENT_ID;
export const SupportServerInvite = "https://discord.gg/G59JT7VbxZ";
export const guildId = "1028789308401918004";
export const color = "#FF6060";
export enum Emojis {
    TextChannel = "<:ChannelText:1034911639243345960>",
    Tada = "<a:tada:1034912799853383731>",
    EditText = "<:EditText:1035654888375472158>",
    MessagePin = "<:MessagePin:1035659644909133825>",
    Clock = "<:IconClock:1035661457922195488>"
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