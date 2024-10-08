import {
  ActivityOptions,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  PermissionFlagsBits,
} from "discord.js";
import { Logging } from "./@types/config";
import { Embed as EmbedBuilder } from "./utils/EmbedBuilder";
import { DEVELOPER_BUILD } from "./index";
import { Icons } from "./icons";

//export const token = process.env.TOKEN;
//export const clientId = process.env.CLIENT_ID;
export const SupportServerInvite = "https://discord.gg/G59JT7VbxZ";
export const SupportServerInviteEmbedded = `<${SupportServerInvite}>`;
export const SupportServerComponent = new ButtonBuilder()
  .setLabel("Support Server")
  .setStyle(ButtonStyle.Link)
  .setURL(SupportServerInvite);
// The channel that you post updates about your bot
export const News = {
  Channel: "1030689173784510504",
  Guild: "1028789308401918004",
};
/**
 * Array of user Ids that are have admin permissions for the bot.
 *
 * **DANGER (READ THIS):** Someone with this permission has access to the entire bot (they could ping `@everyone` or even leave every guild), be careful with this permission.
 */
export const ClientAdministrators: string[] = [
  "820465204411236362",
  //...
];
export const Logs: Logging = {
  // This is required for all the logs below,
  // this is where the bot will fetch the channel from.
  Guild: "1028789308401918004",
  // 🚧 Old Documentation
  // This channel needs to be in
  // the `guildId` server (line 16)
  DM: "1040431450798956594",
  Error: "1042231033627684904",
  Feedback: "1078836800795181056",
};
// This relies on Logs.Guild so make sure that role
// is in the Logs.Guild guild.
export const TeamRole = "1028814696855392297";

export const guildId = "1049143063978709063"; //"1028789308401918004";
export const color = "#FF6060";
export const Version = "v2.0 beta";
export const Website =
  DEVELOPER_BUILD == true
    ? "http://localhost:3000"
    : "https://beepboop.vercel.app";
export const Api =
  DEVELOPER_BUILD == true ? "http://localhost:4000" : "https://api.trtle.xyz";
export const WebsiteLink = (path: string) => Website + path;
export function GenerateTranscriptionURL(GuildId: string, ChannelId: string) {
  return `${Website}/transcript/${ChannelId}`;
}
export const Status: ActivityOptions = {
  type: ActivityType.Listening,
  name: `commands`,
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
  Help = "<:HelpCircle:1044458637579518026>",
}

export { Icons } from "./icons";
export enum OldIcons {
  Statistics = "<:Statistics:1067239843152793660>",
  Quotes = "<:Quotes:1066185365523792042>",
  Member = "<:Member:1065090193494904913>",
  Plane = "<:Plane:1065079776546660512>",
  Date = "<:Date:1061841890384814081>",
  Refresh = "<:Refresh:1043579950197903430>",
  Sync = "<:Sync:1061826576171421736>",
  Star = "<:Star:1061826573222826014>",
  Print = "<:Print:1061826569800253441>",
  Advanced = "<:Advanced:1061826562514751508>",
  Dark = "<:Dark:1061826566373527644>",
  TrashDefault = "<:DefaultTrash:1049878137917419631>",
  Dot = "<:ListItem:1043218649940508712>",
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
  RoleAdd = "<:RoleAdd:1053887102187741304>",
  Search = "<:Search:1066924460495622196>",
  AirdotTeam = "<:AirdotTeam:1079540839065329734>",
}

export const Dot = {
  System: "•",
  Default: Icons.Dot,
};

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
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  AdvancedConfiguration = "⚙️",
  Gift = "🎁",
  Zap = "⚡",
  Trash = "🗑️",
  Enabled = "✔️",
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Disabled = "❌",
  ProUser = "⚡ (pro user) ",
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ResolvableIcons = (client: Client) => Icons;
export const Messages = {
  Saved: {
    content: `${Icons.Discover} Saved your configuration.`,
    ephemeral: true,
    components: [],
  },
  Success: (message: string) => ({
    content: `${Icons.Success} ${message}`,
    ephemeral: true,
    components: [],
  }),
};
export enum Colors {
  Transparent = "#2b2d31", //"#2F3136",
  BrandColor = "#FF605E",
  SuccessButton = "#2d7d46",
}

export const Embed = EmbedBuilder;
export const Permissions = {
  Manager: [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageWebhooks,
  ],
  Moderator: [
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.ManageMessages,
  ],
};
export const BaseDirectory = "./dist";
export const LogSnagProject = "beep-boop";
