import { ActionRow, ActionRowBuilder, AnySelectMenuInteraction, bold, ButtonBuilder, ButtonStyle, Channel, channelMention, ChannelType, Client, Colors, CommandInteraction, ComponentType, GuildTextBasedChannel, inlineCode, ModalBuilder, NewsChannel, PermissionsBitField, PrivateThreadChannel, SelectMenuOptionBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextBasedChannel, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Emojis, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, TextBoolean } from "../utils/config";
import ms from "ms";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { DisableButtons, ResolvedComponent, ResolveComponent } from "@airdot/activities/dist/utils/Buttons";
import { CleanupType } from "../models/Configuration";
import { JSONArray } from "../utils/jsonArray";
import { Modules } from "../commands/Server";
import { ChannelSelectMenu, ChannelSelector as ChannelSelectBuilder } from "../utils/components";
import { CleanupChannel } from "../utils/storage";

export function ResolveEnumValue(selectedEnum: object, selectedValue: string) {
    for (const [k, v] of Object.entries(selectedEnum)) {
        if (k == selectedValue || v == selectedValue) return selectedEnum[k];
    }
}

export function EmbedChildren<T>(array: T[], item: (item: T) => string, noneMessage: string = "None") {
    const GetEmoji = (last: boolean = false) => last ? `${Icons.StemEnd}` : `${Icons.StemItem}`;
    let StringArray = "";
    let at = 0;
    array.forEach(e => {
        at++
        StringArray += `${GetEmoji(at == array.length)} ${item(e)}${at == array.length ? "" : "\n"}`;
    });
    if (array.length <= 0) StringArray = `${Icons.StemEnd} ${noneMessage}`;
    return StringArray;
}

export default class AutonomousCleaningConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.AutonomousCleanup
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client, values: string[]) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let SystemCleanup = Configuration.isSystemCleanup();
        let MessageCleanup = Configuration.isMessageCleanup();
        let TimedCleanup = Configuration.isTimedCleanup();
        let Timer = Configuration?.CleanupTimer;
        let MessageChannels = Configuration?.getCleanupChannels(CleanupType.Message);
        let SystemChannels = Configuration?.getCleanupChannels(CleanupType.System);
        let TimedChannels = Configuration?.getCleanupChannels(CleanupType.Timed);
        let Channels = Configuration?.CleanupChannels;

        enum Id {
            TimedCleanup = "timed_cleanup",
            MessageCleanup = "message_cleanup",
            SystemCleanup = "system_cleanup",
            TimeModal = "timer_modal",
            TimeField = "timer_field",
            AddChannel = "add_channels",
            RemoveChannel = "remove_channels",
            ChannelSelector = "select_a_channel",
            RemoveChannelSelector = "remove_a_channel",
            TypeSelector = "select_a_type"
        }

        const Components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    BackComponent,
                    new ButtonBuilder()
                        .setCustomId(Id.SystemCleanup)
                        .setLabel("System Cleanup")
                        .setStyle(
                            ButtonBoolean(SystemCleanup)
                        ),
                    new ButtonBuilder()
                        .setCustomId(Id.MessageCleanup)
                        .setLabel("Message Cleanup")
                        .setStyle(
                            ButtonBoolean(MessageCleanup)
                        ),
                    new ButtonBuilder()
                        .setCustomId(Id.TimedCleanup)
                        .setLabel("Timed Cleanup")
                        .setStyle(
                            ButtonBoolean(TimedCleanup)
                        )
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(Id.AddChannel)
                        .setLabel("Add Channel")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(Id.RemoveChannel)
                        .setLabel("Remove Channel")
                        .setStyle(ButtonStyle.Secondary)
                )
        ];

        const GenerateEmbed = () => {
            MessageChannels = Channels.filter(e => e.Type == CleanupType.Message)
            SystemChannels = Channels.filter(e => e.Type == CleanupType.System)
            TimedChannels = Channels.filter(e => e.Type == CleanupType.Timed)
            const StringSystemChannels = EmbedChildren<CleanupChannel>(SystemChannels, (item) => channelMention(item.ChannelId), "No channels set")
            const StringMessageChannels = EmbedChildren<CleanupChannel>(MessageChannels, (item) => channelMention(item.ChannelId), "No channels set")
            const StringTimedChannels = EmbedChildren<CleanupChannel>(TimedChannels, (item) => channelMention(item.ChannelId), "No channels set")
            return new Embed(interaction.guild)
                .setTitle("Managing Autonomous Cleanup")
                .addFields([{
                    name: "About Autonomous Cleanup Module",
                    value: `Autonomous Cleanup can cleanup old messages like member's message if they've left or if they left the server their system welcome message will be deleted.`
                }, {
                    name: "Current Configuration",
                    value: `
${TextBoolean(SystemCleanup, "System Cleanup")}
${StringSystemChannels}
${TextBoolean(MessageCleanup, "Message Cleanup")}
${StringMessageChannels}
${TextBoolean(TimedCleanup, "Timed Cleanup")}
${Icons.StemItem} Deletes after: ${Timer == null ? "Nothing set" : ms(Timer)}
${StringTimedChannels}`
                }]);
        }

        const Save = async (editMessage: boolean = true) => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                CleanupType: [
                    ...(SystemCleanup ? [CleanupType.System] : []),
                    ...(MessageCleanup ? [CleanupType.Message] : []),
                    ...(TimedCleanup ? [CleanupType.Timed] : [])
                ],
                CleanupTimer: Timer ?? null,
                CleanupChannels: Channels
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
                customIds: [...GenerateIds(Id), ButtonCollector.BackButton]
            })
        });

        function HandleToggle(id: string) {
            if (id == Id.MessageCleanup) {
                MessageCleanup = !MessageCleanup
            } else if (id == Id.SystemCleanup) {
                SystemCleanup = !SystemCleanup
            } else if (id == Id.TimedCleanup) {
                TimedCleanup = true
            }
        }

        const ChannelSelector = new ChannelSelectBuilder()
            .SetCustomId(Id.ChannelSelector)
            .SetChannelTypes(ChannelType.GuildText);
        Collector.on("collect", async button => {
            if(button.customId == ButtonCollector.BackButton) return;
            if (button.customId == Id.TimedCleanup) {
                const TimerField = new TextInputBuilder()
                    .setLabel("Time to delete")
                    .setPlaceholder("1m 6s")
                    .setCustomId(Id.TimeField)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                await button.showModal(
                    new ModalBuilder()
                        .setTitle("Timed Cleanup")
                        .setCustomId(Id.TimeModal)
                        .addComponents(
                            new ActionRowBuilder<TextInputBuilder>()
                                .addComponents(
                                    TimerField
                                )
                        )
                );

                const ModalInteraction = await button.awaitModalSubmit({
                    time: 0
                });

                Timer = ms(ModalInteraction.fields.getTextInputValue(Id.TimeField));
                TimedCleanup = true;
                await Save();
                await ModalInteraction.reply(Messages.Saved);
                await Message.edit({
                    embeds: [
                        GenerateEmbed()
                    ],
                    components: Components()
                });
            } else if (button.customId == Id.AddChannel) {
                const TypeSelector = new StringSelectMenuBuilder()
                    .addOptions(
                        Object.entries(CleanupType).map(([k, v]) =>
                            new SelectMenuOptionBuilder()
                                .setLabel(k)
                                .setValue(v)
                        )
                    )
                    .setCustomId(Id.TypeSelector);

                const ReplyMessage = await button.reply({
                    ephemeral: true,
                    fetchReply: true,
                    content: `${Icons.Flag} Select a type`,
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                TypeSelector
                            )
                    ]
                });

                const TypeInteraction = await ReplyMessage.awaitMessageComponent({
                    time: 0,
                    componentType: ComponentType.StringSelect,
                    filter: Filter({
                        member: interaction.member,
                        customIds: [Id.TypeSelector]
                    })
                });

                await TypeInteraction.update({
                    content: `${Icons.Channel} Select a channel`,
                    components: [
                        ChannelSelector.toActionRow()
                    ]
                });

                const ChannelInteraction = await ReplyMessage.awaitMessageComponent({
                    time: 0,
                    componentType: ComponentType.ChannelSelect,
                    filter: Filter({
                        member: interaction.member,
                        customIds: [Id.ChannelSelector]
                    })
                });

                const Channel = ChannelInteraction.channels.first();
                const CleanupTypeSelected = TypeInteraction.values[0];
                //const ResolvedChannel = await interaction.guild.channels.fetch(Channel.id);

                if (Channels.includes({
                    ChannelId: Channel.id,
                    Type: ResolveEnumValue(CleanupType, CleanupTypeSelected)
                })) {
                    ChannelInteraction.update({
                        content: `${Icons.Configure} The selected channel already exists.`,
                        components: []
                    });
                    return
                }

                Channels.push({
                    ChannelId: Channel.id,
                    Type: ResolveEnumValue(CleanupType, CleanupTypeSelected)
                });
                await Save();
                await ChannelInteraction.update(Messages.Saved);
            } else if (button.customId == Id.RemoveChannel) {
                if (Channels.length == 0) await button.reply({
                    content: `${Icons.Configure} There's no channels to remove, try adding one first.`,
                    ephemeral: true
                });

                const ResolvedChannels = await new Promise<TextChannel[]>(async (resolve, reject) => {
                    const channels = Promise.all(Channels.map(async e => {
                        const ResolvedChannel = await interaction.guild.channels.fetch(e.ChannelId);
                        if (ResolvedChannel.type != ChannelType.GuildText) return;
                        return ResolvedChannel;
                    }));
                    resolve(channels);
                })
                const RemovalMenu = new StringSelectMenuBuilder()
                    .addOptions(
                        ResolvedChannels.map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.TextChannel)
                        )
                    )
                    .setCustomId(Id.RemoveChannelSelector);

                const ReplyMessage = await button.reply({
                    ephemeral: true,
                    fetchReply: true,
                    content: `${Icons.Channel} Select a channel to remove`,
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                RemovalMenu
                            )
                    ]
                });

                const ChannelInteraction = await ReplyMessage.awaitMessageComponent({
                    time: 0,
                    componentType: ComponentType.StringSelect,
                    filter: Filter({
                        member: interaction.member,
                        customIds: [Id.RemoveChannelSelector]
                    })
                });

                const StringChannels = ChannelInteraction.values;
                //const ResolvedChannel = await interaction.guild.channels.fetch(Channel.id);

                Channels = Channels.filter(e => !StringChannels.includes(e.ChannelId));
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