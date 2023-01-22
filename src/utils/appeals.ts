import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
import { Icons } from "../configuration";

export async function SendAppealMessage(member: GuildMember) {
    const { client, guild } = member;
    const config = await client.Storage.Configuration.forGuild(guild);

    if (!config.hasAppeals()) return;
    const Channel = await member.createDM(true);
    const Components = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setEmoji(Icons.Flag)
                .setLabel("Request an Appeal")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("REQUEST_APPEAL")
        );

    const Message = await Channel.send({
        components: [Components],
        content: `**${Icons.Info} This feature is in preview, some features may not work as expected.**\nWe've noticed you were banned from ${guild.name}, since this server has set up appeals you're able to request an appeal through the button below.`
    });

    client.storage[`${Message.id}`] = guild.id
    client.Storage
}