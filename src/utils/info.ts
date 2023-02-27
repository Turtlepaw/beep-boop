import {
    Guild as DiscordGuild,
    ImageFormat,
    RepliableInteraction,
    TimestampStyles,
    User,
    time,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    inlineCode,
    ChannelType,
    Role as GuildRole,
    APIRole,
    PermissionFlagsBits
} from "discord.js";
import { Colors, Embed, Emojis, Icons, Logs, TeamRole } from "../configuration";

export const Locales = {
    "en-US": "us",
    "en-GB": "gb",
    "bg": "bg",
    "zh-CN": "cn",
    "zh-TW": "tw",
    "hr": "hr",
    "cs": "Cs",
    "da": "da",
    "nl": "nl",
    "fi": "fi",
    "fr": "fr",
    "de": "de",
    "el": "el",
    "hi": "hi",
    "hu": "hu",
    "it": "it",
    "ja": "ja",
    "ko": "ko",
    "lt": "lt",
    "no": "no",
    "pl": "pl",
    "pt-BR": "br",
    "ro": "ro",
    "ru": "ru",
    "es-ES": "rs",
    "sv-SE": "se",
    "th": "th",
    "tr": "tr",
    "uk": "uk",
    "vi": "vi"
};

export const LocaleNames = {
    "en-US": "English US",
    "en-GB": "English GB",
    "bg": "Bulgarian",
    "zh-CN": "Chinese CN",
    "zh-TW": "Chinese TW",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "fi": "Finnish",
    "fr": "French",
    "de": "German",
    "el": "Greek",
    "hi": "Hindi",
    "hu": "Hungarian",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "lt": "Lithuanian",
    "no": "Norwegian",
    "pl": "Polish",
    "pt-BR": "Portuguese BR",
    "ro": "Romanian",
    "ru": "Russian",
    "es-ES": "Spanish ES",
    "sv-SE": "Swedish",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "vi": "Vietnamese"
}

export function Language(locale: string, emoji = false) {
    return `${emoji ? `:flag_${Locales[locale]}: ` : ""}${LocaleNames[locale]}`
}

const Or = " or ";
export type CustomFlags = "Bot" | "ServerOwner" | "AirdotTeam";
export async function MemberInformation(interaction: RepliableInteraction, targetUser: User, hidden = false) {
    const { guild } = interaction;
    if (guild == null) return interaction.reply({
        ephemeral: true,
        content: `There's not enough information, try executing this within a server.`
    });
    const Member = await guild.members.fetch(targetUser.id);
    const User = await targetUser.fetch();
    const AvatarURL = Member.displayAvatarURL({
        extension: ImageFormat.PNG,
        size: 4096
    });
    const BannerURL = User.bannerURL({
        extension: ImageFormat.PNG,
        size: 4096
    });
    const hasBanner = BannerURL != null;

    const Flags = {
        HypeSquadOnlineHouse1: Icons.Bravery,
        HypeSquadOnlineHouse2: Icons.Brilliance,
        HypeSquadOnlineHouse3: Icons.Balance,
        VerifiedBot: Icons.VerifiedBotCheck + Icons.VerifiedBotText,
        Bot: Icons.Bot,
        ActiveDeveloper: Icons.ActiveDeveloper,
        ServerOwner: Icons.ServerOwner,
        AirdotTeam: Icons.AirdotTeam
    };

    const Guild = await interaction.client.guilds.fetch(Logs.Guild);
    const Role = await Guild.roles.fetch(TeamRole);

    const flags = User.flags.toArray() as (CustomFlags | string)[];
    if (User.bot) flags.push("Bot");
    if (interaction.guild.ownerId == User.id) flags.push("ServerOwner");
    if (Role.members.has(User.id)) flags.push("AirdotTeam");

    const MemberRoles = Member.roles.cache.filter(e => e.name != "@everyone");
    // to do - add support for dms
    // like without guild required
    await interaction.reply({
        embeds: [
            new Embed(interaction)
                .setAuthor({
                    iconURL: AvatarURL,
                    name: `${Member.displayName} (${User.tag})`
                })
                .setThumbnail(AvatarURL)
                .setTitle(`Member Information`)
                .addFields([{
                    name: `${Icons.MemberAdd} Member Since`,
                    value: `${time(Member.joinedAt, TimestampStyles.LongDateTime)}${Or}${time(Member.joinedAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Clock} Discord User Since`,
                    value: `${time(User.createdAt, TimestampStyles.LongDateTime)}${Or}${time(User.createdAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Color} Accent Color`,
                    value: User.hexAccentColor != null ? inlineCode(User.hexAccentColor) : "No accent color"
                }, {
                    name: `${Icons.Flag} Roles`,
                    value: MemberRoles.size >= 1 ? MemberRoles.map(e => e.toString()).join(" ") : "No roles",
                    inline: false
                }, {
                    name: `${Icons.Globe} Language`,
                    value: (Member.id == interaction.user.id && interaction.locale != null) ? Language(interaction.locale) : "Unknown",
                    inline: false
                }, {
                    name: `${Icons.Badge} Badges`,
                    value: flags.length >= 1 ? flags.map(e => Flags[e] != null ? Flags[e] : inlineCode(e)).join(" ") : "No badges",
                    inline: false
                }])
                .setColor(Member.displayColor == 0 ? Colors.Transparent : Member.displayHexColor)
                .setFooter({
                    text: `ID: ${Member.id}`
                })
                .setImage(BannerURL)
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(AvatarURL)
                        .setLabel("Avatar URL"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(hasBanner ? BannerURL : "https://bop.trtle.xyz/")
                        .setDisabled(!hasBanner)
                        .setLabel(`Banner URL${hasBanner ? "" : " (disabled)"}`)
                )
        ],
        ephemeral: hidden
    });
}

export enum RoleFlags {
    Hoisted = 1,
    Mentionable = 2
}

export const RoleFlagIcons = {
    [RoleFlags.Hoisted]: Icons.Star,
    [RoleFlags.Mentionable]: Icons.Quotes
}

export async function RoleInformation(interaction: RepliableInteraction, targetRole: GuildRole | APIRole, hidden = false) {
    const { guild } = interaction;
    if (guild == null) return interaction.reply({
        ephemeral: true,
        content: `There's not enough information, try executing this within a server.`
    });
    const Role = await guild.roles.fetch(targetRole.id);
    const Members = Role.members;
    const Flags: RoleFlags[] = [];
    if (Role.hoist) Flags.push(RoleFlags.Hoisted);
    if (Role.mentionable) Flags.push(RoleFlags.Mentionable);

    const hasIcon = Role.icon != null;
    const IconURL = hasIcon ? Role.iconURL({ extension: ImageFormat.PNG }) : null;

    await interaction.reply({
        embeds: [
            new Embed(interaction)
                .setTitle(`Role Information`)
                .setThumbnail(IconURL)
                .addFields([{
                    name: `${Icons.Clock} Created`,
                    value: `${time(Role.createdAt, TimestampStyles.LongDateTime)}${Or}${time(Role.createdAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Members} Members with this role`,
                    value: Members.size >= 1 ? Members.map(e => e.toString()).join(", ") : "No members with this role",
                    inline: false
                }, {
                    name: `${Icons.Color} Color`,
                    value: Role.hexColor != null ? inlineCode(Role.hexColor) : "No color",
                    inline: false
                }, {
                    name: `${Icons.Configure} Permissions`,
                    value: Role.permissions.has(PermissionFlagsBits.Administrator) ? inlineCode("Administrator") : (
                        Role.permissions.toArray().length >= 1 ? Role.permissions.toArray().map(e => inlineCode(e.toString())).join("\u200b".repeat(2)) : "No permissions"
                    ),
                    inline: false
                }, {
                    name: `${Icons.Flag} Flags`,
                    value: Flags.length >= 1 ? Object.entries(RoleFlags).filter(e => Flags.includes(e[1] as RoleFlags)).map(([k, v]) => `${RoleFlagIcons[v]} (${k.toLowerCase()})`).join("\u200b".repeat(2)) : "No flags",
                    inline: false
                }])
                .setColor(Role.color == 0 ? Colors.Transparent : Role.hexColor)
                .setFooter({
                    text: `ID: ${Role.id}`
                })
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(IconURL ?? "https://bop.trtle.xyz")
                        .setLabel("Icon URL")
                )
        ],
        ephemeral: hidden
    });
}

export async function GuildInformation(interaction: RepliableInteraction, targetGuild: DiscordGuild, hidden = false, withComponents: ActionRowBuilder<ButtonBuilder>[] = []) {
    const { guild } = interaction;
    if (guild == null) return interaction.reply({
        ephemeral: true,
        content: `There's not enough information, try executing this within a server.`
    });
    const Guild = await targetGuild.fetch();
    const Member = await Guild.members.fetch(interaction.user.id);
    const AvatarURL = Guild.iconURL({
        extension: ImageFormat.PNG,
        size: 4096
    });
    const BannerURL = Guild.bannerURL({
        extension: ImageFormat.PNG,
        size: 4096
    });
    const hasBanner = BannerURL != null;

    const Flags = {
        NEWS: `${Emojis.News} News`,
        COMMUNITY: `${Emojis.Community} Community`,
        APPLICATION_COMMAND_PERMISSIONS_V2: `${Emojis.Tag} Application Command Permissions V2`
    };

    return await interaction.reply({
        embeds: [
            new Embed(interaction)
                .setAuthor({
                    iconURL: AvatarURL,
                    name: Guild.name
                })
                .setThumbnail(AvatarURL)
                .setTitle(`Server Information`)
                .addFields([{
                    name: `${Icons.Members} Members`,
                    value: `${Guild.members.cache.size} members`
                }, {
                    name: `${Icons.MemberAdd} Member Since`,
                    value: `${time(Member.joinedAt, TimestampStyles.LongDateTime)}${Or}${time(Member.joinedAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Clock} Server Created`,
                    value: `${time(Guild.createdAt, TimestampStyles.LongDateTime)}${Or}${time(Guild.createdAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Flag} Roles`,
                    value: Guild.roles.cache.size >= 1 ? `${(
                        Guild.roles.cache.filter(e => e.name != "@everyone").size.toString()
                    )} roles` : "No roles",
                    inline: false
                }, {
                    name: `${Icons.Globe} Language`,
                    value: (interaction.guildLocale != null) ? Language(interaction.guildLocale) : "Unknown",
                    inline: false
                }, {
                    name: `${Icons.Badge} Badges`,
                    value: Guild.features.length >= 1 ? Guild.features.map(e => Flags[e] != null ? Flags[e] : inlineCode(e)).join(" ") : "No badges",
                    inline: false
                }, {
                    name: `${Icons.Emoji} Emojis`,
                    value: `${Icons.Emoji} (emojis) ${Guild.emojis.cache.size} | ${Icons.Image} (stickers) ${Guild.stickers.cache.size}`
                }, {
                    name: `${Icons.Channel} Channels`,
                    value: `${Icons.Folder} (categories) ${(
                        Guild.channels.cache.filter(e => e.type == ChannelType.GuildCategory)
                    ).size} | ${Icons.Channel} (channels) ${(
                        Guild.channels.cache.filter(e => e.type == ChannelType.GuildText || e.type == ChannelType.GuildAnnouncement)
                    ).size} | ${Icons.Voice} (voice) ${(
                        Guild.channels.cache.filter(e => e.type == ChannelType.GuildVoice || e.type == ChannelType.GuildStageVoice)
                    ).size
                        } `
                }])
                .setColor(Colors.Transparent)
                .setFooter({
                    text: `ID: ${Guild.id}`
                })
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(AvatarURL)
                        .setLabel("Icon URL"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(hasBanner ? BannerURL : "https://bop.trtle.xyz/")
                        .setDisabled(!hasBanner)
                        .setLabel(`Banner URL${hasBanner ? "" : " (disabled)"} `)
                ),
            ...withComponents
        ],
        ephemeral: hidden
    });
}
