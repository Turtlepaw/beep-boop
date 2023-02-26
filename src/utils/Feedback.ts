import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType, Message, RepliableInteraction } from "discord.js";
import { Filter } from "@utils/filter";
import { Logger } from "@logger";
import { Embed, Icons, Logs } from "@config";

export enum FeedbackMoods {
    Happy = "HAPPY",
    Ok = "OK",
    Sad = "SAD"
}

export const FeedbackEmojis = {
    [FeedbackMoods.Happy]: "😀",
    [FeedbackMoods.Ok]: "🫤",
    [FeedbackMoods.Sad]: "🙁"
};

export class FeedbackMessage {
    private interaction: RepliableInteraction;
    private RecordedMessage: Message;

    constructor(interaction: RepliableInteraction) {
        this.interaction = interaction;
    }

    get components() {
        const buttons = Object.values(FeedbackMoods).map(v =>
            new ButtonBuilder()
                .setEmoji(FeedbackEmojis[v])
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(v)
        );

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                buttons
            );

        return {
            toActionRow: () => actionRow,
            toComponents: () => [actionRow],
            buttons
        }
    }

    async collectFrom(Message: Message) {
        const Collector = Message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 0,
            filter: Filter({
                customIds: FeedbackMoods,
                member: this.interaction.member
            })
        });

        Collector.on("collect", async Button => {
            if (this.RecordedMessage == null) {
                await Button.reply({
                    content: `${Icons.Success} Your feedback has been carefully recorded.`,
                    ephemeral: true
                });

                try {
                    const Guild = await Button.client.guilds.fetch(Logs.Guild);
                    const Channel = await Guild.channels.fetch(Logs.Feedback);
                    if (Channel.type != ChannelType.GuildText) return Logger.warn("The Logs.Feedback channel isn't a GuildText channel.");

                    this.RecordedMessage = await Channel.send({
                        embeds: [
                            new Embed(this.interaction)
                                .setTitle("New Feedback Recorded")
                                .addFields([{
                                    name: "Feedback",
                                    value: FeedbackEmojis[Button.customId]
                                }, {
                                    name: "User",
                                    value: `${this.interaction.user.tag} (${this.interaction.user.id})`
                                }])
                        ]
                    });
                } catch (e) {
                    console.warn("There was an error sending feedback, this could be due to the feedback log channel missing.");
                    Logger.error(`Couldn't send feedback: ${e}`);
                }
            } else {
                await Button.reply({
                    content: `${Icons.Success} Your feedback has been edited.`,
                    ephemeral: true
                });

                await this.RecordedMessage.edit({
                    embeds: [
                        new Embed(this.interaction)
                            .setTitle("New Feedback Recorded (edit)")
                            .addFields([{
                                name: "Feedback",
                                value: FeedbackEmojis[Button.customId]
                            }, {
                                name: "User",
                                value: `${this.interaction.user.tag} (${this.interaction.user.id})`
                            }])
                    ]
                });
            }
        });
    }
}