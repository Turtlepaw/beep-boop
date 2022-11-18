import { EmbedBuilder } from "@discordjs/builders";
import { ActivityOptions, ActivityType } from "discord.js";
import { Logging } from "./@types/config";

//export const token = process.env.TOKEN;
//export const clientId = process.env.CLIENT_ID;
export const SupportServerInvite = "https://discord.gg/G59JT7VbxZ";
export const ClientAdministators: string[] = [
    "820465204411236362",
    //...
];
export const Logs: Logging = {
    // This channel needs to be in
    // the `guildId` server (line 16)
    DM: "1040431450798956594",
    Error: "1042231033627684904"
}
export const guildId = "1028789308401918004";
export const color = "#FF6060";
export const Version = "v2.3";
export const Website = "https://beep.trtle.xyz"
export function GenerateTranscriptionURL(GuildId: string, ChannelId: string) {
    return `${Website}/dashboard/${GuildId}/transcription/${ChannelId}`
}
export const Status: ActivityOptions = {
    type: ActivityType.Listening,
    name: `commands`
};
export enum Emojis {
    TextChannel = "<:ChannelText:1034911639243345960>",
    Tada = "<a:tada:1034912799853383731>",
    EditText = "<:EditText:1035654888375472158>",
    MessagePin = "<:MessagePin:1035659644909133825>",
    Clock = "<:IconClock:1035661457922195488>",
    Error = "<:error:966750707715821568>",
    Success = "<:success:966750272846188555>",
    Hide = "<:hide:966750373878587524>",
    Show = "<:show:966750357164286014>",
    Link = "<:link:966750307143024700>",
    Disabled = "<:offswitch:959903558214508564>",
    Enabled = "<:onswitch:959903558310961243>",
    Reason = "<:Reason:1039750995934195762>",
    Information = "<:information:1040450538266964018>",
    Up = "<:up:966750323446263949>",
    Toolbox = "<:Toolbox:1040733188470874112>",
    Role = "<:IconRole:1040823556726083634>",
    Tag = "<:Tag:1040733256028520579>",
    Search = "<:Search:1040733272021405866>",
    ChannelThread = "<:ChannelThread:1041851898313052230>",
    ModerationAction = "<:moderation_action:1039610597618221076>",
    Trash = "<:trash:1039610613866963035>"
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