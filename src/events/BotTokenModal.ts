import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, Events, Guild, GuildMember, Interaction, ModalSubmitInteraction, User } from "discord.js";
import { Filter } from "../utils/filter";
import { Embed, Icons } from "../configuration";
import Event from "../lib/Event";
import { CustomBrandingModal } from "../buttons/ActivateBranding";
import { CustomBotOptions, StartCustomBot } from "../utils/customBot";
import { ChannelSelectMenu } from "../utils/components";
import { Verifiers } from "@airdot/verifiers";
import { FriendlyInteractionError } from "../utils/error";

export async function SetupBot(customClient: Client, client: Client, options: CustomBotOptions & { token: string; }) {
    await client.Storage.CustomBots.Create({
        Token: options.token,
        GuildId: options.guild.id,
        LoggingChannel: options.channel.id,
        Owner: options.owner.id,
        BotId: customClient.user.id
    });
}

export default class AppealModal extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, ModalInteraction: Interaction) {
        if (!ModalInteraction.isModalSubmit()) return;
        if (ModalInteraction.customId != CustomBrandingModal) return;
        const Fields = {
            BotToken: ModalInteraction.fields.getTextInputValue("TOKEN")
        }

        const ChannelMenuId = "CUSTOM_BOT_CHANNEL_MENU";
        const Components = ChannelSelectMenu(ChannelMenuId, ModalInteraction.guild.channels.cache);
        const Message = await ModalInteraction.reply({
            fetchReply: true,
            ephemeral: true,
            content: `${Icons.Channel} Select a channel for your bots logs.`,
            components: [
                Components
            ]
        });

        const ChannelInteraction = await Message.awaitMessageComponent({
            time: 0,
            filter: Filter(ModalInteraction.member, ChannelMenuId),
            componentType: ComponentType.ChannelSelect
        });

        await ChannelInteraction.update({
            fetchReply: true,
            content: "Logging your bot in...",
            components: []
        });

        const SelectedChannel = ChannelInteraction.channels.first();
        if (!Verifiers.Discord.TextChannel(SelectedChannel, false)) return FriendlyInteractionError(ChannelInteraction, "Invalid channel")

        StartCustomBot(Fields.BotToken, client, {
            owner: ModalInteraction.user,
            guild: ModalInteraction.guild,
            client,
            channel: SelectedChannel
        });

        await ChannelInteraction.editReply({
            content: `🎉 Your bot's now online, you should see a message arrive in ${SelectedChannel} when your bot goes online.`
        });
    }
}