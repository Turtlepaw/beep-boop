import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
import { createStore } from "storage-async";

export async function SendAppealMessage(member: GuildMember) {
    const { client, guild } = member;

    if (!(`${guild.id}_appeal_channel` in client.storage)) return;
    const Channel = await member.createDM(true);
    const Components = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setEmoji("📫")
                .setLabel("Request an Appeal")
                .setStyle(ButtonStyle.Success)
                .setCustomId("REQUEST_APPEAL")
        );
    /*const Messages = await Channel.messages.fetch();
    try {
        Messages.first().delete();
    } catch { }*/
    const Message = await Channel.send({
        components: [Components],
        content: `**⚠️ This feature is in preview, some features may not work as expected.**\nWe've noticed you were banned from ${guild.name}... Since this server has set up appeals, you're able to request an appeal through the button below.`
    });

    client.storage[`${Message.id}`] = guild.id
}