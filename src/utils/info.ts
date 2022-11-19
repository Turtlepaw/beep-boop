import {
    Guild,
    GuildMember,
    ImageFormat,
    RepliableInteraction,
    TimestampStyles,
    User,
    time,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    inlineCode
} from "discord.js";
import { Colors, Embed, Icons } from "../configuration";

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
        VerifiedBot: Icons.FlagVerifiedBot
    };

    const Locales = {
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

    await interaction.reply({
        embeds: [
            new Embed()
                .setAuthor({
                    iconURL: AvatarURL,
                    name: Member.displayName
                })
                .setThumbnail(AvatarURL)
                .setTitle(`Member Information`)
                .addFields([{
                    name: `${Icons.MemberAdd} Member Since`,
                    value: `${time(Member.joinedAt, TimestampStyles.LongDateTime)} / ${time(Member.joinedAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Clock} Discord User Since`,
                    value: `${time(User.createdAt, TimestampStyles.LongDateTime)} / ${time(User.createdAt, TimestampStyles.RelativeTime)}`,
                    inline: false
                }, {
                    name: `${Icons.Flag} Roles`,
                    value: Member.roles.cache.size >= 1 ? Member.roles.cache.filter(e => e.name != "@everyone").map(e => e.toString()).join(" ") : "No roles.",
                    inline: false
                }, {
                    name: `${Icons.Globe} Language`,
                    value: (Member.id == interaction.user.id && interaction.locale != null) ? `:flag_${Locales[interaction.locale]}:` : "Unknown.",
                    inline: false
                }, {
                    name: `${Icons.Badge} Badges`,
                    value: User.flags.toArray().length >= 1 ? User.flags.toArray().map(e => Flags[e] != null ? Flags[e] : inlineCode(e)).join(" ") : "No badges.",
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