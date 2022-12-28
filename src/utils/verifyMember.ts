import { GuildMember, ImageFormat } from "discord.js";
import { ResolveUser } from "./Profile";

export const DefaultAvatars = [
    "https://cdn.discordapp.com/embed/avatars/0.png",
    "https://cdn.discordapp.com/embed/avatars/1.png",
    "https://cdn.discordapp.com/embed/avatars/2.png",
    "https://cdn.discordapp.com/embed/avatars/3.png",
    "https://cdn.discordapp.com/embed/avatars/4.png",
    "https://cdn.discordapp.com/embed/avatars/5.png"
];

export async function isSuspicious(member: GuildMember) {
    const Profile = await ResolveUser(member.id, member.client);
    if (DefaultAvatars.includes(member.avatarURL({ extension: ImageFormat.PNG, forceStatic: true }))) {
        return true;
    } else if (Profile.reputation <= 4) {
        return true;
    }
}