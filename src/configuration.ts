import { ActivityOptions, ActivityType, EmbedBuilder } from "discord.js";
import { Logging } from "./@types/config";

//export const token = process.env.TOKEN;
//export const clientId = process.env.CLIENT_ID;
export const SupportServerInvite = "https://discord.gg/G59JT7VbxZ";
// The channel that you post updates about your bot
export const NewsChannel = "1030689173784510504";
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

/**
 * @deprecated use `Icons` instead
 */
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
    Reason = "<:Request:1043020806499868782>",
    Information = "<:information:1040450538266964018>",
    Up = "<:up:966750323446263949>",
    Toolbox = "<:Toolbox:1040733188470874112>",
    Role = "<:IconRole:1040823556726083634>",
    Tag = "<:Tag:1040733256028520579>",
    Search = "<:Search:1040733272021405866>",
    ChannelThread = "<:ChannelThread:1041851898313052230>",
    ModerationAction = "<:moderation_action:1039610597618221076>",
    Trash = "<:trash:1039610613866963035>",
    News = "<:ChannelAnnouncements:1038115805377871893>",
    Community = "<:Community:1043716351447011338>"
}

export enum Icons {
    Clock = "<:Clock:1043579937690497044>",
    MemberAdd = "<:MemberAdd:1043579947639386292>",
    Flag = "<:Flag:1043584066068422747>",
    FlagBrilliance = "<:brilliance:1043588508884938822>",
    FlagBravery = "<:bravery:1043717218866823291>",
    FlagBalance = "<:balance:1043717302564171846>",
    FlagVerifiedBot = "<:VerifiedBot:1043595400701022350><:VerifiedBot:1043595399669231746>",
    Tag = "<:Tag:1040733256028520579>",
    Badge = "<:Badge:1043599252414275634>",
    Globe = "<:Globe:1043599254125563925>",
    Image = "<:Image:1043718873045811271>",
    Emoji = "<:Emoji:1043718870013325394>",
    Channel = "<:Channel:1043584064751423608>",
    Folder = "<:Folder:1043718871422615612>",
    Voice = "<:Voice:1043733614589902878>"
}

export enum Colors {
    Transparent = "#2F3136",
    BrandColor = "#FF605E"
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