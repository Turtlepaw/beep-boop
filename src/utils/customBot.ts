import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonStyle, ChannelType, Client, Events, Guild, inlineCode, PermissionFlagsBits, TextBasedChannel, TextChannel, time, TimestampStyles, User } from "discord.js";
import { SetupBot } from "../events/BotTokenModal";
import { DEFAULT_CLIENT_OPTIONS, HandleAnyBotStart, HandleBotStart } from "..";
import { Colors, Embed, ResolvableIcons } from "../configuration";

export interface CustomBotOptions {
    guild: Guild;
    owner: User;
    client: Client;
    channel: TextBasedChannel;
}

export let customClients = {};

export async function StartCustomBot(botToken: string, client: Client, options?: CustomBotOptions) {
    const started = new Date();
    // Create Discord.js client
    const CustomClient = new Client(DEFAULT_CLIENT_OPTIONS);

    // Get everything ready...
    CustomClient.on(Events.ClientReady, async () => {
        if (options != null) await SetupBot(CustomClient, options.client, {
            ...options,
            token: botToken
        });

        const Bot = await client.Storage.CustomBots.Get({
            Token: botToken
        });

        customClients[Bot.BotId] = CustomClient;
        HandleAnyBotStart(CustomClient);
        if (Bot.CustomStatus != null) CustomClient.user.setPresence({
            status: Bot.CustomStatusPresence || "online",
            activities: [{
                name: Bot.CustomStatus,
                type: Bot.CustomStatusType
            }]
        });

        //let IconsGuild = await CustomClient.guilds.fetch("1043579620022292510");
        CustomClient.CustomIcons = true;
        const Guild = await CustomClient.guilds.fetch(Bot.GuildId);
        const Channel = await Guild.channels.fetch(Bot.LoggingChannel) as TextChannel;
        const StatusType = {
            Listening: "Listening to",
            Playing: "Playing",
            Watching: "Watching",
        }
        const Icons = ResolvableIcons(client);
        const Status = (status: string) => StatusType[status] ?? "";
        await Channel.send({
            embeds: [
                new Embed()
                    .setTitle("🎉 Your custom bot is online!")
                    .addFields([{
                        name: `${Icons.Clock} Started`,
                        value: time(started, TimestampStyles.RelativeTime)
                    }, {
                        name: `${Icons.Discover} Your Bot`,
                        value: `<@${Bot.BotId}>`
                    }, {
                        name: `${Icons.Configure} Bot Configuration`,
                        value: `• Status: ${Bot.CustomStatus != null ? inlineCode(`${Status(ActivityType[Bot.CustomStatusType])} ${Bot.CustomStatus}`) : "None."}
• Logging Channel: <#${Bot.LoggingChannel}>
• Owner: <@${Bot.Owner}>`
                    }])
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("CUSTOM_BRANDING")
                            .setLabel("Configure Bot"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://discord.com/developers/applications/${Bot.BotId}`)
                            .setLabel("Customize Bot")
                    )
            ]
        });
    });

    CustomClient.login(botToken);
}

export async function StartCustomBots(client: Client) {
    const Bots = await client.Storage.CustomBots.GetAll();

    for (const CustomBot of Bots) {
        StartCustomBot(CustomBot.Token, client);
    }
}