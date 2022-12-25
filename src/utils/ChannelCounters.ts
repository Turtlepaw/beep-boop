import { Client } from "discord.js";
import ms from "ms";
import { VaribleRunner } from "./Varibles";
const Time = ms("10m");

export async function ChannelCounterService(client: Client) {
    const Guilds = await client.Storage.Configuration.GetAll();

    for (const Guild of Guilds) {
        if (Guild.CounterChannels == null || Guild.CounterChannels.length <= 0) return;
        const ResolvedGuild = await client.guilds.fetch(Guild.Id);
        const Channels = Guild?.CounterChannels;

        for (const Counter of Channels) {
            const Channel = await ResolvedGuild.channels.fetch(Counter.Id);

            setInterval(() => {
                Channel.edit({
                    name: new VaribleRunner(Counter.Name).run({ guild: ResolvedGuild })
                });
            }, Time);
        }
    }
}