import { ActionRowBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonStyle, channelMention, ChannelType, Client, ComponentType } from "discord.js";
import { Embed, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, StringBoolean, TextBoolean } from "../utils/config";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { ModuleInformation, Modules } from "../commands/Server";
import { ChannelSelector as ChannelSelectorBuilder } from "../utils/components";

const Module = ModuleInformation.TICKET_CONFIGURATION;
export default class TicketConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.Tickets
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let Tickets = Configuration.hasTickets();
        let TicketCategory = Configuration?.Tickets?.Category;

        enum Id {
            ToggleModule = "TOGGLE_MODULE",
            SetChannel = "SET_CHANNEL",
            ChannelSelector = "CHANNEL_SELECTOR"
        }

        const ChannelSelector = new ChannelSelectorBuilder()
            .SetCustomId(Id.ChannelSelector)
            .SetChannelTypes(
                ChannelType.GuildCategory
            );

        const Components = () => [
            new ButtonBuilder()
                .setCustomId(Id.ToggleModule)
                .setLabel(`${Tickets == true ? "Disable" : "Enable"} Module`)
                .setStyle(
                    ButtonBoolean(Tickets)
                ),
            new ButtonBuilder()
                .setCustomId(Id.SetChannel)
                .setLabel(`Set Channel`)
                .setStyle(ButtonStyle.Secondary)
        ];

        const GenerateEmbed = () => new Embed(interaction.guild)
            .setTitle("Managing Tickets")
            .addFields([{
                name: "About Tickets",
                value: Module.Description//`Tickets let members talk to moderators through a private channel.`
            }, {
                name: "Current Configuration",
                value: `
${TextBoolean(Tickets, `Module ${StringBoolean(Tickets, false)}`)}
${Icons.StemEnd} Category: ${TicketCategory == null ? "None" : channelMention(TicketCategory)}`
            }]);

        const Message = await interaction.update({
            fetchReply: true,
            embeds: [
                GenerateEmbed()
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        BackComponent,
                        ...Components()
                    )
            ]
        });

        const Save = async () => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                TicketsCategory: TicketCategory,
                TicketsStatus: Tickets
            });

            await Message.edit({
                embeds: [
                    GenerateEmbed()
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            BackComponent,
                            ...Components()
                        )
                ]
            });
        }

        const Collector = Message.createMessageComponentCollector({
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: [...GenerateIds(Id), ButtonCollector.BackButton]
            })
        });

        Collector.on("collect", async button => {
            if (button.customId == ButtonCollector.BackButton) return;
            if (button.customId == Id.ToggleModule) {
                if (Tickets == false && TicketCategory == null) {
                    Tickets = true;
                    const ReplyMessage = await button.reply({
                        ephemeral: true,
                        fetchReply: true,
                        content: `${Icons.Channel} Select a channel`,
                        components: ChannelSelector.toComponents()
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
                    const ResolvedChannel = await interaction.guild.channels.fetch(Channel.id);

                    TicketCategory = ResolvedChannel.id;
                    await Save();
                    await ChannelInteraction.update(Messages.Saved);
                } else {
                    Tickets = Tickets == null ? true : !Tickets;
                    Save();
                    await button.reply(Messages.Saved);
                }
            } else if (button.customId == Id.SetChannel) {
                const ReplyMessage = await button.reply({
                    ephemeral: true,
                    fetchReply: true,
                    content: `${Icons.Channel} Select a channel`,
                    components: ChannelSelector.toComponents()
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
                const ResolvedChannel = await interaction.guild.channels.fetch(Channel.id);

                TicketCategory = ResolvedChannel.id;
                await Save();
                await ChannelInteraction.update(Messages.Saved);
            }
        });

        ButtonCollector.AttachBackButton(Collector);
    }
}