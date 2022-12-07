import decancer from "decancer";
import { GuildMember } from "discord.js";
import { FormatUsername } from "./text";

export function CleanText(text: string) {
    return decancer(text);
}

export async function CleanMember(member: GuildMember) {
    const username = member.user.username;
    const cleaned = FormatUsername(
        CleanText(username)
    );
    await member.setNickname(cleaned);
    return cleaned;
}