import {
    Guild as DiscordGuild,
    GuildMember,
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
    Locale
} from "discord.js";
import { Colors, Embed, Emojis, Icons } from "../configuration";

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

export function Language(locale: string, emoji: boolean = false) {
    return `${emoji ? `:flag_${Locales[locale]}: ` : ""}${LocaleNames[locale]}`
}

const Or = " or ";
export async function MemberInformation(interaction: RepliableInteraction, targetUser: User, hidden: boolean = false) {
    const { guild } = interaction;
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
        HypeSquadOnlineHouse1: Icons.FlagBravery,
        HypeSquadOnlineHouse2: Icons.FlagBrilliance,
        HypeSquadOnlineHouse3: Icons.FlagBalance,
        VerifiedBot: Icons.FlagVerifiedBot,
        Bot: Icons.FlagBot
    };

    const flags = User.flags.toArray();
    //@ts-expect-error
    if (User.bot) flags.push("Bot");

    await interaction.reply({
        embeds: [
            new Embed()
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
                    value: User.hexAccentColor != null ? inlineCode(User.hexAccentColor) : "No accent color."
                }, {
                    name: `${Icons.Flag} Roles`,
                    value: Member.roles.cache.size >= 1 ? Member.roles.cache.filter(e => e.name != "@everyone").map(e => e.toString()).join(" ") : "No roles.",
                    inline: false
                }, {
                    name: `${Icons.Globe} Language`,
                    value: (Member.id == interaction.user.id && interaction.locale != null) ? Language(interaction.locale) : "Unknown.",
                    inline: false
                }, {
                    name: `${Icons.Badge} Badges`,
                    value: flags.length >= 1 ? flags.map(e => Flags[e] != null ? Flags[e] : inlineCode(e)).join(" ") : "No badges.",
                    inline: false
                }])
                .setColor(Member.displayColor == 0 ? Colors.Transparent : Member.displayHexColor)
                .setFooter({
                    text: `ID: ${Member.id}`
                })
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

export async function GuildInformation(interaction: RepliableInteraction, targetGuild: DiscordGuild, hidden: boolean = false) {
    const { guild } = interaction;
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

    await interaction.reply({
        embeds: [
            new Embed()
                .setAuthor({
                    iconURL: AvatarURL,
                    name: Guild.name
                })
                .setThumbnail(AvatarURL)
                .setTitle(`Server Information`)
                .addFields([{
                    name: `${Icons.MemberAdd} Member Since`,
                    value: `${time(Member.joinedAt, TimestampStyles.LongDateTime)}${Or}${time(Member.joinedAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Clock} Server Created`,
                    value: `${time(Guild.createdAt, TimestampStyles.LongDateTime)}${Or}${time(Guild.createdAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Flag} Roles`,
                    value: Guild.roles.cache.size >= 1 ? Guild.roles.cache.filter(e => e.name != "@everyone").size.toString() : "No roles.",
                    inline: false
                }, {
                    name: `${Icons.Globe} Language`,
                    value: (interaction.guildLocale != null) ? Language(interaction.guildLocale) : "Unknown.",
                    inline: false
                }, {
                    name: `${Icons.Badge} Badges`,
                    value: Guild.features.length >= 1 ? Guild.features.map(e => Flags[e] != null ? Flags[e] : inlineCode(e)).join(" ") : "No badges.",
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
                    ).size}`
                }])
                .setColor(Member.displayColor == 0 ? Colors.Transparent : Member.displayHexColor)
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
                        .setLabel(`Banner URL${hasBanner ? "" : " (disabled)"}`)
                )
        ],
        ephemeral: hidden
    });
}