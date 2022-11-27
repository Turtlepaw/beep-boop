import { APIGuildMember, ButtonInteraction, GuildMember, MessageComponentInteraction } from "discord.js";

export function Filter(member: (APIGuildMember | GuildMember), ...customIds: (string | boolean)[]) {
    let debug = false;
    if (customIds[0] == true) debug = true;
    return (Interaction: MessageComponentInteraction) => {
        const debugJson = JSON.stringify({
            user: Interaction.user.username,
            customId: Interaction.customId,
            memberMatches: !(member != null && Interaction.user.id != member.user.id),
            customIdMatches: customIds.includes(Interaction.customId),
            matches: (member != null && Interaction.user.id != member.user.id) && customIds.includes(Interaction.customId),
            member: member.user.username,
            customIds
        })
        if (debug == true) console.log(`Filter Interaction Received:`.green, debugJson)//` {\n   user: "${Interaction.user.username}",\n   customId: "${Interaction.customId}",\n  matches: ${customIds.includes(Interaction.customId) && (member != null && Interaction.user.id != member.user.id)},\n   ...\n}`.gray)
        if (member != null && Interaction.user.id != member.user.id) return false;
        return customIds.includes(Interaction.customId)
    }
}