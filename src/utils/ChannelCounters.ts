/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, GuildBasedChannel } from "discord.js";
import { VaribleRunner } from "./Varibles";
const Time = 10000;

export async function ChannelCounterService(client: Client) {
        setInterval(async () => {
const Guilds = await client.Storage.Configuration.GetAll();

    Guilds.forEach(async Guild => {
            const ResolvedGuild = await client.guilds.fetch(Guild.Id);
            const Config = await client.Storage.Configuration.forGuild(ResolvedGuild);
            if (config?.CounterChannels == null || config?.CounterChannels?.size <= 0) return;
            const Channels = Config?.CounterChannels;
            for (const [id, Counter] of Channels) {
                let Channel: GuildBasedChannel;
                try {
                    Channel = await ResolvedGuild.channels.fetch(id);
                } catch (e) {
                    Config.CounterChannels.delete(id);
                    client.Storage.Configuration.Edit(Config.CustomId, {
                        CounterChannels: Config.CounterChannels
                    });
                    return;
                }

                Channel.edit({
                    name: await new VaribleRunner(Counter.Name)
                        .run({ guild: ResolvedGuild })
                });

                // const timer = setInterval(async () => {
                //     Guild = await client.Storage.Configuration.Get({ CustomId: Guild.CustomId });
                //     try {
                //         Channel = await Channel.fetch() as any;
                //     } catch (e) {
                //         Guild.CounterChannels.delete(id);
                //         client.Storage.Configuration.Edit(Guild.CustomId, {
                //             CounterChannels: Guild.CounterChannels
                //         });
                //         clearInterval(timer);
                //     }

                //     console.log("Running", await new VaribleRunner(Counter.Name).run({ guild: ResolvedGuild }))
                //     Channel.edit({
                //         name: await new VaribleRunner(Counter.Name)
                //             .run({ guild: ResolvedGuild })
                //     });
                // }, Time);
            }
});
        }, Time)
}
