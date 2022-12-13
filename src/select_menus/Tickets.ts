import { ActionRow, ActionRowBuilder, AnySelectMenuInteraction, bold, ButtonBuilder, ButtonStyle, channelMention, ChannelType, Client, Colors, CommandInteraction, ComponentType, inlineCode, ModalBuilder, PermissionsBitField, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons, Messages } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, TextBoolean } from "../utils/config";
import ms from "ms";
import { Filter, GenerateIds } from "../utils/filter";
import { DisableButtons, ResolvedComponent, ResolveComponent } from "@airdot/activities/dist/utils/Buttons";
import { CleanupType } from "../models/Configuration";
import { JSONArray } from "../utils/jsonArray";
import { Modules } from "../commands/Server";
import { ChannelSelectMenu } from "../utils/components";

export default class AutonomousCleaning extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"],
            Value: Modules.Tickets
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client, values: string[]) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let Tickets = Configuration.hasTickets();
        let TicketCategory = Configuration?.TicketCategory;

        enum Id {
            ToggleModule = "TOGGLE_MODULE",
            SetChannel = "SET_CHANNEL",
            ChannelSelector = "CHANNEL_SELECTOR"
        }

        const ChannelSelector = ChannelSelectMenu(Id.ChannelSelector, ChannelType.GuildCategory);

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

        const GenerateEmbed = () => new Embed()
            .setTitle("Managing Tickets")
            .addFields([{
                name: "About Tickets",
                value: `Tickets let members talk to moderators through a private channel.`
            }, {
                name: "Current Configuration",
                value: `
${TextBoolean(Tickets, "Module Enabled")}
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
            await client.Storage.Configuration.Edit({
                Id: Configuration.Id
            }, {
                TicketCategory
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
            filter: Filter(interaction.member, ...GenerateIds(Id))
        });

        Collector.on("collect", async button => {
            if (button.customId == Id.ToggleModule) {
                Tickets = !Tickets;
                Save();
                await button.reply(Messages.Saved);
            } else if (button.customId == Id.SetChannel) {
                const ReplyMessage = await button.reply({
                    ephemeral: true,
                    fetchReply: true,
                    content: `${Icons.Channel} Select a channel`,
                    components: [
                        ChannelSelector
                    ]
                });

                const ChannelInteraction = await ReplyMessage.awaitMessageComponent({
                    time: 0,
                    componentType: ComponentType.ChannelSelect,
                    filter: Filter(interaction.member, Id.ChannelSelector)
                });

                const Channel = ChannelInteraction.channels.first();
                const ResolvedChannel = await interaction.guild.channels.fetch(Channel.id);

                TicketCategory = ResolvedChannel.id;
                await Save();
                await ChannelInteraction.update(Messages.Saved);
            }
        });

        Collector.on("end", async () => {
            Message.edit({
                components: [
                    new ActionRowBuilder<ResolvedComponent>()
                        .addComponents(
                            DisableButtons(Message.components[0].components)
                        )
                ]
            });
        });
    }
}