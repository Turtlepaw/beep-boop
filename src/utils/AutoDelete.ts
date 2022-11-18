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
        const Channels: AutoDelete = client.Storage.Get(`${Guild.id}_auto_deleting`);

        if (Channels?.AfterTime == null) continue;
        if (stop) return;

        for (const Channel of Channels.Channels) {
            const ResolvedChannel = await ResolvedGuild.channels.fetch(Channel);
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
                }, Number(Channels.AfterTime));
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