import { APIGuildMember, ButtonInteraction, GuildMember, MessageComponentInteraction } from "discord.js";

export function Filter(member?: (APIGuildMember | GuildMember), ...customIds: string[]) {
    return (Interaction: MessageComponentInteraction) => {
        if (member != null && Interaction.user.id != member.user.id) return false;
        return customIds.includes(Interaction.customId)
    }
}