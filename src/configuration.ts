import { ActivityOptions, ActivityType, ButtonBuilder, ButtonStyle, Client, PermissionFlagsBits } from "discord.js";
import { Logging, SavedMessages } from "./@types/config";
import { Embed as EmbedBuilder } from "./utils/EmbedBuilder";

//export const token = process.env.TOKEN;
//export const clientId = process.env.CLIENT_ID;
export const SupportServerInvite = "https://discord.gg/G59JT7VbxZ";
export const SupportServerInviteEmbedded = `<${SupportServerInvite}>`
export const SupportServerComponent = new ButtonBuilder()
    .setLabel("Support Server")
    .setStyle(ButtonStyle.Link)
    .setURL(SupportServerInvite);
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
export const guildId = "1049143063978709063"; //"1028789308401918004";
export const color = "#FF6060";
export const Version = "v2.3";
export const Website = "https://beep.trtle.xyz"
export const WebsiteLink = (path: string) => Website + path;
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
    Community = "<:Community:1043716351447011338>",
    Help = "<:HelpCircle:1044458637579518026>"
}

export enum Icons {
    Clock = "<:Clock:1043579937690497044>",
    MemberAdd = "<:MemberAdd:1043579947639386292>",
    Flag = "<:Flag:1043584066068422747>",
    FlagBrilliance = "<:brilliance:1043588508884938822>",
    FlagBravery = "<:bravery:1043717218866823291>",
    FlagBalance = "<:balance:1043717302564171846>",
    FlagVerifiedBot = "<:VerifiedBot:1043595400701022350><:VerifiedBot:1043595399669231746>",
    FlagActiveDeveloper = "<:ActiveDeveloper:1049873261615382668>",
    FlagServerOwner = "<:ServerOwner:1049873748397936652>",
    FlagBot = "<:Bot:1040733154656403616>",
    FlagOffline = "<:StatusOffline:1044019373775540276>",
    FlagOnline = "<:StatusOnline:1044019293307801680>",
    Tag = "<:Tag:1053881213112295505>",
    Badge = "<:Badge:1043599252414275634>",
    Globe = "<:Globe:1043599254125563925>",
    Image = "<:Image:1043718873045811271>",
    Emoji = "<:Emoji:1043718870013325394>",
    Channel = "<:Channel:1043584064751423608>",
    Folder = "<:Folder:1043718871422615612>",
    Voice = "<:Voice:1043733614589902878>",
    Color = "<:Color:1043579942811750410>",
    Link = "<:Link:1043579945777119242>",
    Error = "<:Error:1054103452579549326>",
    Success = "<:Success:1054103410183524402>",
    Members = "<:Members:1044023938591756370>",
    Info = "<:Info:1044457273990324264>",
    Shield = "<:Shield:1044472705845563442>",
    Lock = "<:Lock:1044474659749507082>",
    Unlock = "<:Unlock:1044474661519495188>",
    Configure = "<:Configure:1046915276043726890>",
    Discover = "<:Discover:1046915294624501821>",
    AdvancedConfiguration = "<:ConfigureAdvanced:1046915256225640600>",
    Gift = "<:Gift:1046915229453406310>",
    Zap = "<:Zap:1046915192191197214>",
    Trash = "<:Trash:1043579951586213888>",
    Enabled = "<:Enabled:1049904633939763211>",
    Disabled = "<:Disabled:1049904650989600849>",
    ProUser = "<:ProUser:1051214860119191634>",
    Blank = "<:blank:1049914365752651796>",
    StemItem = "<:StemItem:1051630581340971108>",
    StemEnd = "<:StemEnd:1051630676354551839>",
    Remove = "<:Remove:1053887107921363034>",
    Add = "<:Add:1053887100551966771>",
    RoleRemove = "<:RoleRemove:1053887104842735677>",
    RoleAdd = "<:RoleAdd:1053887102187741304>"
}

export enum DefaultIcons {
    Clock = "⏱️",
    MemberAdd = "➕",
    Flag = "🚩",
    FlagBrilliance = "💡 (brilliance) ",
    FlagBravery = "🪨 (bravery) ",
    FlagBalance = "⚖️ (balance) ",
    FlagVerifiedBot = "✔️ (verified bot) ",
    FlagActiveDeveloper = "💻 (active developer) ",
    FlagServerOwner = "👑 (server owner) ",
    FlagBot = "🤖 (bot) ",
    FlagOffline = "🔴",
    FlagOnline = "🟢",
    Tag = "🏷️",
    Badge = "🎖️",
    Globe = "🌐",
    Image = "🖼️",
    Emoji = "😀",
    Channel = "#️⃣",
    Folder = "📂",
    Voice = "🎙️",
    Color = "🎨",
    Link = "🔗",
    Error = "❌",
    Success = "✅",
    Members = "👤",
    Info = "ℹ️",
    Shield = "🛡️",
    Lock = "🔒",
    Unlock = "🔓",
    Configure = "⚙️",
    Discover = "🧭",
    AdvancedConfiguration = "⚙️",
    Gift = "🎁",
    Zap = "⚡",
    Trash = "🗑️",
    Enabled = "✔️",
    Disabled = "❌",
    ProUser = "⚡ (pro user) "
}

export const ResolvableIcons = (client: Client) => Icons;
export const Messages = {
    Saved: {
        content: `${Icons.Discover} Saved your configuration.`,
        ephemeral: true,
        components: []
    }
}
export enum Colors {
    Transparent = "#2F3136",
    BrandColor = "#FF605E",
    SuccessButton = "#2d7d46"
}

export const Embed = EmbedBuilder;
export const Permissions = {
    Manager: [PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageGuild]
}