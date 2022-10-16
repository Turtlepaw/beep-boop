import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
import { createStore } from "storage-async";

export async function SendAppealMessage(member: GuildMember) {
    const { client, guild } = member;

    const Channel = await member.createDM(true);
    const Components = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setEmoji("📫")
                .setLabel("Request an Appeal")
                .setStyle(ButtonStyle.Success)
                .setCustomId("REQUEST_APPEAL")
        );
    const Messages = await Channel.messages.fetch();
    try {
        Messages.first().delete();
    } catch { }
    await Channel.send({
        components: [Components],
        content: `**⚠️ We're having some issues on our end, and this message may send twice.**\nWe've noticed you were banned from ${guild.name}... This server has set up appeals, you're able to request an appeal through the button below.`
    });
}