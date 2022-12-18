import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, Events, GuildMember, Message, MessageType, TextChannel } from "discord.js";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";

let stop = false;
export interface AutoDelete {
    Channels: string[];
    AfterTime: number;
}

async function AutoDeleteMessageService(message: Message) {
    await message.delete();
}

export async function StartAutoDeleteService(client: Client) {
    const Guilds = await client.guilds.fetch();

    if (stop) return;
    for (let Guild of Guilds.values()) {
        const ResolvedGuild = await Guild.fetch();
        const Configuration = await client.Storage.Configuration.Get({
            Id: Guild.id
        });

        const Channels = Configuration?.CleanupChannels;

        if (Channels == null) continue;
        if (Configuration.CleanupTimer == null) continue;
        if (stop) return;

        for (const Channel of Channels) {
            const ResolvedChannel = await ResolvedGuild.channels.fetch(Channel.ChannelId);
            if (stop) return;
            if (ResolvedChannel?.type != ChannelType.GuildText) return;
            const MessageCollector = ResolvedChannel.createMessageCollector({
                time: 0
            });

            MessageCollector.on('collect', async message => {
                if (stop) return;
                setTimeout(() => {
                    if (stop) return;
                    AutoDeleteMessageService(message);
                }, Number(Configuration.CleanupTimer));
            });
        }
    }
}

export function StopAutoDeleteService() {
    stop = true;
    setTimeout(() => {
        stop = false;
    }, 2);
}