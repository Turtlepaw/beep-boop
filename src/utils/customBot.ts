import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  codeBlock,
  Events,
  Guild,
  inlineCode,
  OAuth2Scopes,
  PermissionFlagsBits,
  TextBasedChannel,
  TextChannel,
  time,
  TimestampStyles,
  User,
  WebhookClient,
} from "discord.js";
import { SetupBot } from "../events/BotTokenModal";
import { DEFAULT_CLIENT_OPTIONS, HandleAnyBotStart } from "..";
import { Embed, ResolvableIcons, SupportServerInvite } from "../configuration";
import { Logger } from "../logger";
import { DeepPartial } from "typeorm";
import { CustomBot } from "../models/CustomBot";

export interface CustomBotOptions {
  guild: Guild;
  owner: User;
  client: Client;
  channel: TextBasedChannel;
}

export const customClients: Record<string, Client> = {};

export function CreateConfiguration(client: Client) {
  if (typeof client.token != "string")
    return console.warn("This custom bot doesn't have a token".red);
  setTimeout(async () => {
    console.log("Creating configuration...");
    let num = 0;
    const Guilds = await client.guilds.fetch();
    for (const guild of Guilds.values()) {
      try {
        const config = await client.Storage.Configuration.forGuild(guild);
        if (config?.raw == null) {
          num++;
          client.Storage.Configuration.CreateConfiguration(guild);
        }
      } catch (e) {
        console.log("Error:".red, e);
        Logger.error(`Couldn't create configuration for ${guild.name}: ${e}`);
      }
    }

    Logger.info(`Created configuration for ${num} guilds`);
  }, 5000);
}

export function StartCustomBot(
  botToken: string,
  client: Client,
  options?: CustomBotOptions
) {
  return new Promise<{
    CustomClient: Client;
    config: DeepPartial<CustomBot>;
    // eslint-disable-next-line no-async-promise-executor
  }>(async (resolve, reject) => {
    const started = new Date();
    // Create Discord.js client
    const CustomClient = new Client(DEFAULT_CLIENT_OPTIONS);

    CreateConfiguration(CustomClient);

    CustomClient.login(botToken).catch(reject);

    const config = await new Promise<DeepPartial<CustomBot>>((resolve) => {
      // Get everything ready...
      CustomClient.on(Events.ClientReady, async () => {
        if (options != null)
          await SetupBot(
            CustomClient,
            options.client,
            {
              ...options,
              token: botToken,
            },
            () => ""
          );

        const Bot = await client.Storage.CustomBots.Get({
          Token: botToken,
        });

        customClients[Bot.BotId] = CustomClient;
        HandleAnyBotStart(CustomClient);
        if (Bot.CustomStatus != null)
          CustomClient.user.setPresence({
            status: Bot.CustomStatusPresence || "online",
            activities: [
              {
                name: Bot.CustomStatus,
                type: Bot.CustomStatusType,
              },
            ],
          });

        //let IconsGuild = await CustomClient.guilds.fetch("1043579620022292510");
        CustomClient.CustomIcons = true;
        if (Bot.WebhookURL != null)
          CustomClient.LogWebhook = new WebhookClient({
            url: Bot.WebhookURL,
          });
        const Guild = await CustomClient.guilds.fetch(Bot.GuildId);
        const Channel = (await Guild.channels.fetch(
          Bot.LoggingChannel
        )) as TextChannel;
        const StatusType = {
          Listening: "Listening to",
          Playing: "Playing",
          Watching: "Watching",
        };
        const Icons = ResolvableIcons(client);
        const Status = (status: string) => StatusType[status] ?? "";
        await Channel.send({
          embeds: [
            new Embed(Guild)
              .setTitle("🎉 Your custom bot is online!")
              .addFields([
                {
                  name: `${Icons.Clock} Started`,
                  value: time(started, TimestampStyles.RelativeTime),
                },
                {
                  name: `${Icons.Discover} Your Bot`,
                  value: `<@${Bot.BotId}>`,
                },
                {
                  name: `${Icons.Configure} Bot Configuration`,
                  value: `• Status: ${
                    Bot.CustomStatus != null
                      ? inlineCode(
                          `${Status(ActivityType[Bot.CustomStatusType])} ${
                            Bot.CustomStatus
                          }`
                        )
                      : "None"
                  }
• Logging Channel: <#${Bot.LoggingChannel}>
• Owner: <@${Bot.Owner}>`,
                },
              ]),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("CUSTOM_BRANDING")
                .setLabel("Configure Bot"),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(
                  `https://discord.com/developers/applications/${Bot.BotId}`
                )
                .setLabel("Customize Bot"),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(
                  CustomClient.generateInvite({
                    scopes: [
                      OAuth2Scopes.Bot,
                      OAuth2Scopes.ApplicationsCommands,
                    ],
                    permissions: [PermissionFlagsBits.Administrator],
                  })
                )
                .setLabel("Add to Server")
            ),
          ],
        });

        Logger.info(`${CustomClient.user.tag} is now online.`);
        resolve(Bot);
      });
    });

    resolve({
      CustomClient,
      config,
    });
  });
}

export async function HandleBot(
  options?: CustomBotOptions & {
    client: Client;
    botToken: string;
    webhook?: string;
  }
) {
  try {
    return await StartCustomBot(options.botToken, options.client, options);
  } catch (e) {
    const hook = new WebhookClient({ url: options.webhook });
    await SendWebhookError(hook, e);
    return e as string;
  }
}

export function SendWebhookError(
  webhook: WebhookClient,
  e: string,
  customBotId?: string
) {
  return webhook.send({
    content: `**Your custom bot couldn't start, here's what we know:**\n${codeBlock(
      e.toString()
    )}`,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Troubleshooting")
          .setStyle(ButtonStyle.Link)
          .setURL("https://docs.trtle.xyz/pro/troubleshooting"),
        new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle(ButtonStyle.Link)
          .setURL(SupportServerInvite),
        customBotId != null
          ? new ButtonBuilder()
              .setLabel("Retry")
              .setStyle(ButtonStyle.Primary)
              .setCustomId(`RETRY_${customBotId}`)
          : null
      ),
    ],
  });
}

export async function StartCustomBots(client: Client) {
  Logger.info(`Starting custom bots.`);
  const Bots = await client.Storage.CustomBots.GetAll();

  for (const CustomBot of Bots) {
    try {
      await StartCustomBot(CustomBot.Token, client);
    } catch (e) {
      try {
        const webhook = new WebhookClient({ url: CustomBot.WebhookURL });
        await SendWebhookError(webhook, e, CustomBot.BotId);
      } catch (e) {
        Logger.error(
          `Couldn't get webhook for ${CustomBot.Owner}'s custom bot`
        );
      }
    }
  }
}
