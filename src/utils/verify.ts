/* eslint-disable @typescript-eslint/no-explicit-any */
import { GuildTextBasedChannel, NewsChannel, TextChannel as GuildTextChannel } from "discord.js";
import fetch from "axios";

function isHexColor(str: string): str is `#${string}` {
    return str.startsWith("#");
}

function String(str: string): str is string {
    if (str == '') return false;
    return typeof str == 'string';
}

const LinkRegEx = {
    Strict: (/^(http|https):\/\/[^ "]+$/gi),
    Lazy: (/^([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+.*)$/gi)
};

function Link(str: string, strict = true) {
    const RegEx = (strict ? LinkRegEx.Strict : LinkRegEx.Lazy);
    return RegEx.test(str);
}

async function InviteLink(str: string) {
    //const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord.com\/invite|watchanimeattheoffice.com\/invite|dis.gd\/invite|bigbean.solutions\/invite)\/+[a-zA-Z0-9]{4,16}/gi;
    if (!Link(str, false)) return false;
    if (!str.startsWith("http://") || !str.startsWith("https://")) str = `http://${str}`;
    const web = await fetch(str);
    const location = web.request.res.responseUrl;
    return location.startsWith("https://discord.com/invite");
}

function TextChannel(channel: any): channel is GuildTextBasedChannel {
    return channel?.send != null;
}

function GuildText(channel: any): channel is (NewsChannel | GuildTextChannel) {
    return channel?.send != null;
}

function Emoji(emoji: string, animated = false) {
    if (!String(emoji)) return false;
    return (
        emoji.startsWith("<:") || (animated == true ? emoji.startsWith("<a:") : false)
    ) && emoji.endsWith(">") && emoji.length >= 20;
}

export const Verifiers = {
    isHexColor,
    String,
    InviteLink,
    Link,
    TextChannel,
    GuildText,
    Emoji
}