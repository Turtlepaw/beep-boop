/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, Guild } from "discord.js";
import { MessageType } from "../models/Message";
import ms from "ms";
import { Logger } from "../logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function ActionMessage(messageId: string, channelId: string, guild: Guild) {
    try {
        const Channel = await guild.channels.fetch(channelId);
        if (!Channel.isTextBased()) return;
        return Channel.messages.delete(messageId);
    } catch (e) {
        Logger.error(`Error deleting message in ${guild.name}: ${e}`)
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function Refresh(client: Client) {
    return;
    // const Messages = await client.Storage.Messages.FindBy({
    //     Type: MessageType.CleanupMessage
    // });

    // for (const Message of Messages) {
    //     const CreatedAt = new Date(Message.CreatedAt);
    //     const Guild = await client.guilds.fetch(Message.Guild);
    //     const Configuration = await client.Storage.Configuration.forGuild(Guild);
    //     const TimePassed = Date.now() - Message.CreatedAt;
    //     if (TimePassed >= Configuration.CleanupTimer) ActionMessage(
    //         Message.Message,
    //         Message.Channel,
    //         Guild
    //     );
    // }
}

export async function StartAutoDeleteService(client: Client) {
    setInterval(() => {
        Refresh(client);
    }, ms("1s"))
}