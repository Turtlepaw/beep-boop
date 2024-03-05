import decancer from "decancer";
import { GuildMember } from "discord.js";

export function CleanText(text: string) {
  return decancer(text);
}

export async function CleanMember(member: GuildMember) {
  const username = member.user.displayName;
  const cleaned = CleanText(username).toString();
  return cleaned;
}
