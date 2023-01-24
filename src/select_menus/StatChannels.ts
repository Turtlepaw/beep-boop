/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-const */
import { ActionRowBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonStyle, channelMention, ChannelType, Client, inlineCode, ModalBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Embed, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent } from "../utils/config";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { CounterChannel } from "../models/Configuration";
import { ModuleInformation, Modules } from "../commands/Server";
import { ChannelSelector as ChannelSelectBuilder, StringSelector } from "../utils/components";
import { EmbedChildren } from "./AutoDeleting";

export const Module = ModuleInformation.STAT_CHANNELS;
export default class AutonomousCleaningConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.StatisticsChannels
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let Channels = Configuration.CounterChannels;

        enum Id {
            AddChannel = "ADD_CHANNEL",
            RemoveChannel = "REMOVE_CHANNEL"
        }

        enum Modal {
            Id = "CREATE_CHANNEL_MODAL",
            ChannelName = "CHANNEL_NAME"
        }

        const Components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    BackComponent,
                    new ButtonBuilder()
                        .setCustomId(Id.AddChannel)
                        .setLabel("Add Channel")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(Id.RemoveChannel)
                        .setLabel("Remove Channel")
                        .setStyle(ButtonStyle.Danger)
                )
        ];

        const GenerateEmbed = () => {
            const FormattedChannels = EmbedChildren<CounterChannel>(Array.from(Channels.values()), (item) => `${channelMention(item.Id)} (${inlineCode(item.Name)})`, "No channels set")
            return new Embed(interaction.guild)
                .setTitle("Managing Statistic Channels")
                .addFields([{
                    name: "About Statistic Channels",
                    value: Module.Description
                }, {
                    name: "Current Configuration",
                    value: `
${Icons.StemItem} Channels:
${FormattedChannels}`
                }]);
        }

        const Save = async (editMessage = true) => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                CounterChannels: Channels
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

        const ChannelSelector = new ChannelSelectBuilder()
            .SetCustomId(Id.AddChannel)
            .SetChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildVoice
            );

        Collector.on("collect", async button => {
            if (button.customId == ButtonCollector.BackButton) return;
            if (button.customId == Id.AddChannel) {
                const ButtonMessage = await button.reply({
                    content: `${Icons.Channel} Select a channel`,
                    components: ChannelSelector.toComponents(),
                    ephemeral: true,
                    fetchReply: true
                });

                const ChannelInteraction = await ChannelSelector.CollectComponents(ButtonMessage, interaction);
                const Channel = ChannelInteraction.channels.first();
                const Resolved = await interaction.guild.channels.fetch(Channel.id);

                const ChannelComponent = new TextInputBuilder()
                    .setCustomId(Modal.ChannelName)
                    .setLabel("Channel Name")
                    .setMaxLength(100)
                    .setMinLength(1)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("You can use varibles, see available varibles with /varibles")
                    .setValue(Resolved.name);
                const ModalBuild = new ModalBuilder()
                    .setTitle("Add Stat Channel")
                    .setCustomId(Modal.Id)
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .setComponents(ChannelComponent)
                    );

                await ChannelInteraction.showModal(ModalBuild);
                const modal = await ChannelInteraction.awaitModalSubmit({
                    time: 0
                });

                if (Channels.has(Channel.id)) {
                    modal.reply({
                        content: `${Icons.Configure} The selected channel already exists`,
                        components: []
                    });
                    return
                }

                Channels.set(Channel.id, {
                    Disabled: false,
                    Id: Channel.id,
                    Name: modal.fields.getTextInputValue(Modal.ChannelName)
                });

                await Save();
                await modal.reply(Messages.Saved);
            } else if (button.customId == Id.RemoveChannel) {
                if (Channels.size == 0) await button.reply({
                    content: `${Icons.Configure} There's no channels to remove, try adding one first.`,
                    ephemeral: true
                });


                const MappedChannels = await Promise.all(
                    Array.from(Channels.entries()).map(async ([k]) => await interaction.guild.channels.fetch(k))
                );

                const RemovalMenu = new StringSelector()
                    .AddOptions(
                        ...MappedChannels.map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Icons.Channel)
                        )
                    )
                    .SetCustomId(Id.RemoveChannel)
                    .Placeholder("Select a channel...")
                    .Min(1)
                    .Max(MappedChannels.length);

                const ReplyMessage = await button.reply({
                    ephemeral: true,
                    fetchReply: true,
                    content: `${Icons.Channel} Select a channel to remove`,
                    components: RemovalMenu.toComponents()
                });

                const ChannelInteraction = await RemovalMenu.CollectComponents(ReplyMessage, interaction);

                const StringChannels = ChannelInteraction.values;
                //const ResolvedChannel = await interaction.guild.channels.fetch(Channel.id);

                StringChannels.map(e => Channels.delete(e));
                await Save();
                await ChannelInteraction.update(Messages.Saved);
            }
        });

        ButtonCollector.AttachBackButton(Collector);
    }
}