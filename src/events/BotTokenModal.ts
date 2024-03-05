import {
  Channel,
  ChannelType,
  Client,
  ComponentType,
  Events,
  Interaction,
} from "discord.js";
import { Filter } from "../utils/filter";
import { Icons } from "../configuration";
import Event from "../lib/Event";
import { CustomBrandingModal } from "../buttons/Subscription/CustomBranding";
import { CustomBotOptions, HandleBot } from "../utils/customBot";
import { ChannelSelectMenu } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Logger } from "../logger";
import { CustomBot } from "../models/CustomBot";
import { DeepPartial } from "typeorm";

export async function SetupBot(
  customClient: Client,
  client: Client,
  options: CustomBotOptions & { token: string },
  callback?: (value: DeepPartial<CustomBot>) => unknown
) {
  const value = await client.Storage.CustomBots.Create({
    Token: options.token,
    GuildId: options.guild.id,
    LoggingChannel: options.channel.id,
    Owner: options.owner.id,
    BotId: customClient.user.id,
  });

  callback(value[0]);
}

export default class AppealModal extends Event {
  constructor() {
    super({
      EventName: Events.InteractionCreate,
    });
  }

  async ExecuteEvent(client: Client, ModalInteraction: Interaction) {
    if (!ModalInteraction.isModalSubmit()) return;
    if (ModalInteraction.customId != CustomBrandingModal) return;
    const Fields = {
      BotToken: ModalInteraction.fields.getTextInputValue("TOKEN"),
    };

    const ChannelMenuId = "CUSTOM_BOT_CHANNEL_MENU";
    const Components = ChannelSelectMenu(
      ChannelMenuId,
      ModalInteraction.guild.channels.cache
    );
    const Message = await ModalInteraction.reply({
      fetchReply: true,
      ephemeral: true,
      content: `${Icons.Channel} Select a channel for your bots logs.`,
      components: [Components],
    });

    const ChannelInteraction = await Message.awaitMessageComponent({
      time: 0,
      filter: Filter({
        member: ModalInteraction.member,
        customIds: [ChannelMenuId],
      }),
      componentType: ComponentType.ChannelSelect,
    });

    await ChannelInteraction.update({
      fetchReply: true,
      content: "Logging your bot in...",
      components: [],
    });

    const SelectedChannel = ChannelInteraction.channels.first() as Channel;
    if (SelectedChannel.type != ChannelType.GuildText)
      return FriendlyInteractionError(ChannelInteraction, "Invalid channel");

    const bot = await HandleBot({
      owner: ModalInteraction.user,
      guild: ModalInteraction.guild,
      client,
      channel: SelectedChannel,
      botToken: Fields.BotToken,
    });

    function isResolvable(c: unknown): c is {
      CustomClient: Client<boolean>;
      config: DeepPartial<CustomBot>;
    } {
      return c?.["CustomClient"] != null;
    }

    if (bot == null) {
      Logger.error(`Error setting up a bot for ${ModalInteraction.user.tag}`);
      await ChannelInteraction.editReply({
        content: `Something didn't go as planned, you might want to re-check your configuration and token.`,
      });
    } else if (isResolvable(bot)) {
      await ChannelInteraction.editReply({
        content: `🎉 Your bot's now online, you should see a message arrive in ${SelectedChannel} when your bot goes online.`,
      });

      const Webhook = await SelectedChannel.createWebhook({
        name: `${bot.CustomClient.user.username}`,
        avatar: bot.CustomClient.user.avatarURL() || null,
        reason: "Custom Bot logging webhook",
      });

      await Webhook.send({
        content: `This channel has been set up to receive logs for ${ModalInteraction.user}'s custom bot. (${bot.CustomClient.user})`,
      });

      await client.Storage.CustomBots.Edit(
        {
          CustomId: bot.config.CustomId,
        },
        {
          LoggingChannel: SelectedChannel.id,
          WebhookURL: Webhook.url,
        }
      );
    }
  }
}
