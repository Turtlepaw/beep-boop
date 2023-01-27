/* eslint-disable prefer-const */
import { ActionRowBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonStyle, ChannelType, Client, channelMention, userMention } from "discord.js";
import { Embed, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, TextBoolean } from "../utils/config";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { ModuleInformation, Modules } from "../commands/Guild/Server";
import { ChannelSelector as ChannelSelectBuilder, StringSelectBuilder, StringSelector } from "../utils/components";
import { EmbedChildren } from "./AutoDeleting";

export const Module = ModuleInformation.APPEAL_CONFIGURATION;
export default class AutonomousCleaningConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.Appeals
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let AppealStatus = Configuration.Appeals.Status;
        let AppealChannel = Configuration.Appeals.Channel;
        let AppealBlocks = Configuration.Appeals.Blocked;

        enum Id {
            Appeals = "APPEAL_TOGGLE",
            AppealBlockRemove = "REMOVE_APPEAL_BLOCK",
            BlockSelector = "BLOCK_SELECTOR",
            ChannelSelector = "CHANNEL_SELECTOR",
        }

        const Components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    BackComponent,
                    new ButtonBuilder()
                        .setCustomId(Id.Appeals)
                        .setLabel("Appeals")
                        .setStyle(
                            ButtonBoolean(AppealStatus)
                        ),
                    new ButtonBuilder()
                        .setCustomId(Id.ChannelSelector)
                        .setLabel("Set Channel")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(Id.AppealBlockRemove)
                        .setLabel("Remove Block")
                        .setStyle(ButtonStyle.Danger)
                )
        ];

        const GenerateEmbed = () => {
            const Blocks = EmbedChildren<string>(Array.from(AppealBlocks.values()), (item) => {
                const CacheUser = client.users.cache.get(item);
                if (CacheUser == null) return userMention(item);
                else return CacheUser.tag;
            })
            return new Embed(interaction.guild)
                .setTitle("Managing Appeals")
                .addFields([{
                    name: "About Appeals",
                    value: Module.Description
                }, {
                    name: "Current Configuration",
                    value: `
${TextBoolean(AppealStatus, "Appeals Status")}
${Icons.StemItem} Appeal Channel: ${AppealChannel == null ? "None" : channelMention(AppealChannel)}
${Icons.StemItem} Appeal Block List:
${AppealBlocks.size == 0 ? `${Icons.StemEnd} None` : Blocks}`
                }]);
        }

        const Save = async (editMessage = true) => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                Appeals: AppealStatus,
                AppealChannel,
                AppealBlocks
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
            if (id == Id.Appeals) {
                AppealStatus = !AppealStatus;
            }
        }

        const ChannelSelector = new ChannelSelectBuilder()
            .SetCustomId(Id.ChannelSelector)
            .SetChannelTypes(ChannelType.GuildText);

        Collector.on("collect", async button => {
            if (button.customId == ButtonCollector.BackButton) return;
            if (button.customId == Id.AppealBlockRemove) {
                if (AppealBlocks.size == 0) {
                    button.reply({
                        ephemeral: true,
                        content: `${Icons.Discover} You haven't blocked anyone yet.`
                    })
                    return;
                }
                const Selector = new StringSelector()
                    .AddOptions(
                        ...Array.from(AppealBlocks.values()).map(e => {
                            const CacheUser = client.users.cache.get(e);
                            const User = CacheUser != null ? CacheUser.tag : e;
                            return new StringSelectBuilder()
                                .setLabel(User)
                                .setValue(e);
                        })
                    )
                    .Placeholder("Select a user...")
                    .SetCustomId(Id.BlockSelector)
                    .Min(1)
                    .Max(AppealBlocks.size);

                const Message = await button.reply({
                    ephemeral: true,
                    content: `${Icons.Flag} Select a user to unblock`,
                    components: Selector.toComponents(),
                    fetchReply: true
                });

                const Component = await Selector.CollectComponents(Message, interaction);

                Component.values.map(e => AppealBlocks.delete(e));
                await Save();
                await Component.update(Messages.Saved);
            } else if (button.customId == Id.ChannelSelector) {
                const Message = await button.reply({
                    content: `${Icons.Channel} Select a channel`,
                    components: ChannelSelector.toComponents(),
                    fetchReply: true,
                    ephemeral: true
                });

                const ChannelInteraction = await ChannelSelector.CollectComponents(Message, interaction);
                const Channel = ChannelInteraction.channels.first();

                AppealChannel = Channel.id;
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