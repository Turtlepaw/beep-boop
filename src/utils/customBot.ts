import { ChannelType, Client, Events, PermissionFlagsBits, TextChannel } from "discord.js";
import { DEFAULT_CLIENT_OPTIONS, HandleBotStart } from "..";

export async function StartCustomBot(botToken: string) {
    // Create Discord.js client
    const CustomClient = new Client(DEFAULT_CLIENT_OPTIONS);

    // Get everything ready...
    CustomClient.on(Events.ClientReady, async () => {
        const Guild = CustomClient.guilds.cache.first();
        const Channel = Guild.channels.cache.filter(e => e.type == ChannelType.GuildText && e.permissionsFor(Guild.members.me).has(PermissionFlagsBits.SendMessages)).first() as TextChannel;
        await Channel.send({
            content: "🎉 Your custom bot is online!"
        });
    });

    CustomClient.login(botToken);
}

export async function StartCustomBots(client: Client) {
    const Bots = await client.Storage.CustomBots.GetAll();

    for (const CustomBot of Bots) {
        StartCustomBot(CustomBot.Token);
    }
}