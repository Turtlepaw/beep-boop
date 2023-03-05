import { ActionRowBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonStyle, channelMention, ChannelType, Client, inlineCode, MessageComponentInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Embed, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, EmojiBoolean, StringBoolean } from "../utils/config";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { Modules } from "../commands/Guild/Server";
import { StringSelectBuilder, StringSelector, ChannelSelector as ChannelSelectBuilder } from "../utils/components";
import { ConfigurationEvents } from "../@types/Logging";

export default class BasicServerConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.ServerConfiguration
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let Color = Configuration?.Color;
        let Events = Configuration?.Logging?.Categories;
        let LoggingStatus = Configuration?.Logging?.Status;
        let LoggingChannel = Configuration?.Logging?.Channel;

        enum Id {
            SetColorButton = "SET_COLOR",
            ColorModal = "SET_COLOR_MODAL",
            ColorField = "COLOR_MODAL_FIELD",
            EnableLogging = "ENABLE_LOGGING",
            SetEvents = "SET_LOGGING_EVENTS",
            SetEventsSelector = "SET_LOGGING_EVENTS_SELECTOR",
            ChannelSelector = "CHANNEL_SELECTOR",
            SelectChannel = "SELECT_LOG_CHANNEL"
        }

        const Components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    BackComponent,
                    new ButtonBuilder()
                        .setCustomId(Id.SetColorButton)
                        .setLabel("Set Color")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(!Configuration.isPremium()),
                    new ButtonBuilder()
                        .setCustomId(Id.EnableLogging)
                        .setLabel("Enable Logging")
                        .setStyle(ButtonBoolean(LoggingStatus)),
                    new ButtonBuilder()
                        .setCustomId(Id.SetEvents)
                        .setLabel("Logging Events")
                        .setStyle(ButtonStyle.Secondary),
                )
        ];

        const GenerateEmbed = () => {
            return new Embed(interaction)
                .setTitle(`Managing ${interaction.guild}`)
                .addFields([{
                    name: "About Server Settings",
                    value: `This provides basic server configuration. (e.g. color, moderation channel, etc...)`
                }, {
                    name: "Current Configuration",
                    value: `
${Icons.Dot} Color
${Icons.StemEnd} ${Color == null ? "None" : inlineCode(Color)}
${Icons.Dot} Logging
${Icons.StemItem} Status: ${StringBoolean(LoggingStatus, true)} ${EmojiBoolean(LoggingStatus)}
${Icons.StemItem} Channel: ${LoggingChannel == null ? "None" : channelMention(LoggingChannel)}
${Icons.StemEnd} Events: ${Events.size == 0 ? "None" : `${Events.size} event${Events.size > 1 ? "s" : ""}`}`
                }]).Resolve();
        }

        const Save = async (editMessage = true) => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                Color,
                LoggingStatus,
                LoggingCategories: Events,
                LoggingChannel
            });

            if (editMessage) await Message.edit({
                embeds: [
                    await GenerateEmbed()
                ],
                components: Components()
            });
        }

        const Message = await interaction.update({
            fetchReply: true,
            embeds: [
                await GenerateEmbed()
            ],
            components: Components()
        });

        const Collector = Message.createMessageComponentCollector({
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: [...GenerateIds(Id), ButtonCollector.BackButton]
            })
        });

        const ChannelSelector = new ChannelSelectBuilder()
            .SetCustomId(Id.ChannelSelector)
            .SetChannelTypes(ChannelType.GuildText);

        async function selectChannel(button: MessageComponentInteraction) {
            const Message = await button.reply({
                content: `${Icons.Channel} Select a channel`,
                components: ChannelSelector.toComponents(),
                fetchReply: true,
                ephemeral: true
            });

            const ChannelInteraction = await ChannelSelector.CollectComponents(Message, interaction);
            const SelectedChannel = ChannelInteraction.channels.first();
            return {
                SelectedChannel,
                ChannelInteraction
            };
        }

        Collector.on("collect", async button => {
            if (button.customId == ButtonCollector.BackButton) return;
            if (button.customId == Id.SetColorButton) {
                const ColorField = new TextInputBuilder()
                    .setLabel("Color to display on embeds")
                    .setPlaceholder("#5865f2 (blurple)")
                    .setCustomId(Id.ColorField)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                await button.showModal(
                    new ModalBuilder()
                        .setTitle("Embed Color")
                        .setCustomId(Id.ColorModal)
                        .addComponents(
                            new ActionRowBuilder<TextInputBuilder>()
                                .addComponents(
                                    ColorField
                                )
                        )
                );

                const ModalInteraction = await button.awaitModalSubmit({
                    time: 0
                });

                Color = ModalInteraction.fields.getTextInputValue(Id.ColorField);
                await Save();
                await ModalInteraction.reply(Messages.Saved);
                // await Message.edit({
                //     embeds: [
                //         await GenerateEmbed()
                //     ],
                //     components: Components()
                // });
            } else if (button.customId == Id.EnableLogging) {
                let inter = button;
                const isNull = LoggingChannel == null;
                if (LoggingChannel == null) {
                    const { ChannelInteraction, SelectedChannel } = await selectChannel(button);
                    inter = ChannelInteraction;
                    LoggingChannel = SelectedChannel.id;
                }

                LoggingStatus = !LoggingStatus;
                await Save(isNull);

                if (isNull) {
                    await inter.update({
                        embeds: [
                            await GenerateEmbed()
                        ],
                        components: Components()
                    });
                } else {
                    await inter.update(Messages.Saved);
                }
            } else if (button.customId == Id.SetEvents) {
                const Selector = new StringSelector()
                    .SetCustomId(Id.SetEventsSelector)
                    .Placeholder("Select events to log...")
                    .Min(1)
                    .Max(Object.values(ConfigurationEvents).length)
                    .AddOptions(
                        ...Object.entries(ConfigurationEvents).map(([k, v]) =>
                            new StringSelectBuilder()
                                .setLabel(v)
                                .setValue(k)
                                .setDefault(Events.has(v))
                        )
                    );

                const SelectorMessage = await button.reply({
                    components: Selector.toComponents(),
                    content: `${Icons.Flag} Select events to log`,
                    ephemeral: true,
                    fetchReply: true
                });

                const component = await Selector.CollectComponents(SelectorMessage, button);
                Events = new Set(component.values.map(e => ConfigurationEvents[e]));
                await Save();
                await component.update(Messages.Saved);
            } else if (button.customId == Id.SelectChannel) {
                const { ChannelInteraction, SelectedChannel } = await selectChannel(button);
                LoggingChannel = SelectedChannel.id;
                await Save();
                await ChannelInteraction.update(Messages.Saved);
            }
        });

        ButtonCollector.AttachBackButton(Collector);
    }
}