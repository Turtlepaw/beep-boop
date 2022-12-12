import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, codeBlock, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, WebhookClient } from "discord.js";
import { SendError } from "../utils/error";
import { Embed, Emojis, Icons, SupportServerComponent, SupportServerInvite, SupportServerInviteEmbedded } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { HandleBot, StartCustomBot } from "../utils/customBot";
import { Logger } from "../logger";

export default class RetryBot extends Button {
    constructor() {
        super({
            CustomId: "RETRY_{any}",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: [],
            RequireIdFetching: true
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client, Id: string) {
        const Bot = await client.Storage.CustomBots.Get({
            CustomId: Id
        });

        Logger.info(`Starting ${Bot.BotId} by the request of ${interaction.user.username}`);
        (async () => {
            try {
                await StartCustomBot(Bot.Token, client);
            } catch (e) {
                try {
                    const webhook = new WebhookClient({ url: Bot.WebhookURL });
                    await webhook.send({
                        content: `**Your custom bot couldn't start, here's what we know:**\n${codeBlock(e.toString())}`,
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Troubleshooting")
                                        .setStyle(ButtonStyle.Link)
                                        .setURL("https://docs.trtle.xyz/pro/troubleshooting"),
                                    new ButtonBuilder()
                                        .setLabel("Support Server")
                                        .setStyle(ButtonStyle.Link)
                                        .setURL(SupportServerInvite),
                                    new ButtonBuilder()
                                        .setLabel("Retry")
                                        .setStyle(ButtonStyle.Primary)
                                        .setCustomId(`RETRY_${Bot.CustomId}`)
                                )
                        ]
                    });
                } catch (e) {
                    Logger.error(`Couldn't get webhook for ${Bot.Owner}'s custom bot`)
                }
            }
        })();

        await interaction.reply({
            content: `${Icons.Zap} We've started your custom bot, if this error continues you can request help in our [support server](${SupportServerInviteEmbedded}).`,
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        SupportServerComponent
                    )
            ],
            ephemeral: true
        });
    }
}