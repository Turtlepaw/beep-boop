/* eslint-disable prefer-const */
import { ActionRowBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, GuildMember, Interaction, RepliableInteraction, TextBasedChannel, TextInputStyle, channelMention } from "discord.js";
import { Embed, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, TextBoolean } from "../utils/config";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { ModuleInformation, Modules } from "../commands/Guild/Server";
import { ActionRowHandler, ChannelSelector as ChannelSelectBuilder, GetTextInput } from "../utils/components";
import D from "discord.js";
import { TextInputComponentData } from "discord.js";
import { Omit } from "@utils/Configure";
import { TextInputBuilder } from "discord.js";

export interface FieldPartial {
    label: string;
    style: TextInputStyle;
    maxLength?: number;
    minLength?: number;

}

export enum FeedbackFields {
    LeaveReason = 1
}

export const Fields = {
    [FeedbackFields.LeaveReason]: {
        label: "Why did you leave?",
        required: true,
        minLength: 5,
        style: TextInputStyle.Paragraph
    }
} satisfies Record<FeedbackFields, Omit<Omit<TextInputComponentData, "customId">, "type">>;


const FeedbackCollectButtonId = "COLLECT_FEEDBACK_BUTTON";
const TestFeedbackButtonId = "TRY_FEEDBACK_OUT";
export class FeedbackManager {
    static CollectButton = FeedbackCollectButtonId;
    static TryFeedback = TestFeedbackButtonId;

    public member: GuildMember;
    public ButtonId = FeedbackCollectButtonId;

    constructor(member: GuildMember) {
        this.member = member;
    }

    public async send(interaction?: RepliableInteraction) {
        const { guild, client } = this.member;
        const Configuration = await client.Storage.Configuration.forGuild(guild);
        function createError() {
            return interaction.reply({
                content: `${Icons.Configure} You haven't configured Leave Feedback yet, configure it with ${client.CommandManager.getCommand(client.CommandManager.knownCommands.Configuration)}`,
                ephemeral: true
            })
        }

        if (Configuration?.LeaveFeedback?.Status == false) return createError();
        if (Configuration?.LeaveFeedback?.Channel == null) return createError();
        if (interaction != null) interaction.reply({
            content: `${Icons.Clipboard} Sent you a DM!`,
            ephemeral: true
        });

        const Row = new ActionRowHandler(
            new ButtonBuilder()
                .setLabel("Feedback")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(Icons.Clipboard)
                .setCustomId(this.ButtonId)
        );

        console.log(this.member.client.user.tag)
        const user = await client.users.fetch(this.member.id);
        console.log(client.user.tag, user.client.user.tag)
        const Channel = await user.createDM(true);
        console.log(Channel.client.user.tag)

        return await Channel.send({
            // draft - to be improved
            content: `${Icons.Discover} Give feedback about why you left this server to help the owners make it better!`,
            components: Row.toComponents()
        });
    }

    public async collect(channel: string, interaction?: ButtonInteraction, origin?: Interaction) {
        const isTest = interaction != null;
        const ModalBuilder = new D.ModalBuilder()
            .setCustomId("FEEDBACK_MODAL")
            .setTitle("Feedback")
            .addComponents(
                Object.entries(Fields).map(([k, v]) =>
                    new ActionRowBuilder<TextInputBuilder>()
                        .setComponents(
                            new TextInputBuilder(v)
                                .setCustomId(k)
                        )
                )
            );

        await interaction.showModal(ModalBuilder);
        const modal = await interaction.awaitModalSubmit({
            time: 0
        });

        await modal.reply({
            content: `${Icons.Brush} Thanks for your feedback, we'll use this to make your experience better!`,
            ephemeral: true
        });

        const embed = new Embed(origin)
            .setTitle(`Leave Feedback${isTest ? " (test)" : ""}`)
            .setAuthor({
                name: this.member?.nickname ?? this.member.user.username,
                iconURL: this.member.displayAvatarURL()
            });

        Object.entries(Fields).map(([k, v]) => {
            const val = GetTextInput(k, modal);
            embed.addFields([{
                name: v.label,
                value: (val == null || val.length < 1) ? "(empty)" : val
            }]);

        });

        const Channel = await this.member.guild.channels.fetch(channel) as TextBasedChannel;
        await Channel.send({
            embeds: [
                embed
            ]
        });
    }
}

export const Module = ModuleInformation[Modules.LeaveFeedback];
export default class LeaveFeedbackConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.LeaveFeedback
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let Status = Configuration.LeaveFeedback?.Status;
        let Channel = Configuration.LeaveFeedback?.Channel;

        enum Id {
            Appeals = "LEAVE_FEEDBACK_TOGGLE",
            ChannelSelector = "CHANNEL_SELECTOR",
            TryItOut = "TRY_OUT_FEEDBACK"
        }

        const Components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    BackComponent,
                    new ButtonBuilder()
                        .setCustomId(Id.Appeals)
                        .setLabel("Leave Feedback")
                        .setStyle(
                            ButtonBoolean(Status)
                        ),
                    new ButtonBuilder()
                        .setCustomId(Id.ChannelSelector)
                        .setLabel("Set Channel")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(Icons.Channel),
                    new ButtonBuilder()
                        .setEmoji(Icons.Search)
                        .setLabel("Try this out")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(TestFeedbackButtonId)
                )
        ];

        const GenerateEmbed = () => {
            return new Embed(interaction)
                .setTitle("Managing Leave Feedback")
                .addFields([{
                    name: "About Leave Feedback",
                    value: Module.Description
                }, {
                    name: "Current Configuration",
                    value: `
${TextBoolean(Status, "Leave Feedback Status")}
${Icons.StemEnd} Feedback Channel: ${Channel == null ? "None" : channelMention(Channel)}`
                }]);
        }

        const Save = async (editMessage = true) => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                LeaveFeedbackStatus: Status,
                LeaveFeedbackChannel: Channel
            });

            if (editMessage) await Message.edit({
                embeds: [
                    GenerateEmbed()
                ],
                components: Components()
            });
        }

        const Message = await interaction.update({
            fetchReply: true,
            embeds: [
                GenerateEmbed()
            ],
            components: Components()
        });

        const Collector = Message.createMessageComponentCollector({
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: [...GenerateIds(Id), ButtonCollector.BackButton, FeedbackManager.TryFeedback]
            })
        });

        function HandleToggle(id: string) {
            if (id == Id.Appeals) {
                Status = !Status
            }
        }

        const ChannelSelector = new ChannelSelectBuilder()
            .SetCustomId(Id.ChannelSelector)
            .SetChannelTypes(ChannelType.GuildText);

        Collector.on("collect", async button => {
            if (button.customId == ButtonCollector.BackButton) return;
            if (button.customId == Id.ChannelSelector) {
                const Message = await button.reply({
                    content: `${Icons.Channel} Select a channel`,
                    components: ChannelSelector.toComponents(),
                    fetchReply: true,
                    ephemeral: true
                });

                const ChannelInteraction = await ChannelSelector.CollectComponents(Message, interaction);
                const SelectedChannel = ChannelInteraction.channels.first();

                Channel = SelectedChannel.id;
                await Save();
                await ChannelInteraction.update(Messages.Saved);
            } else {
                HandleToggle(button.customId);
                await Save(false);
                await button.update({
                    embeds: [
                        GenerateEmbed()
                    ],
                    components: Components()
                });
            }
        });

        ButtonCollector.AttachBackButton(Collector);
    }
}