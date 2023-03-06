/* eslint-disable prefer-const */
import { ActionRowBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonStyle, ChannelType, Client, MessageComponentInteraction, ModalBuilder, TextInputStyle, channelMention } from "discord.js";
import { Embed, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, TextBoolean } from "../utils/config";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { ModuleInformation, Modules } from "../commands/Guild/Server";
import { ChannelSelector as ChannelSelectBuilder } from "../utils/components";
import { TextInputBuilder } from "discord.js";

export const Module = ModuleInformation[Modules.Starboard];
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
        let Status = Configuration.Starboard?.Status;
        let Channel = Configuration.Starboard?.Channel;
        let Reaction = Configuration.Starboard?.Reaction;

        enum Id {
            Starboard = "STARBOARD_TOGGLE",
            ChannelSelector = "CHANNEL_SELECTOR",
            ReactionSelector = "SELECT_REACTION"
        }

        const Components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    BackComponent,
                    new ButtonBuilder()
                        .setCustomId(Id.Starboard)
                        .setLabel("Highlights")
                        .setStyle(
                            ButtonBoolean(Status)
                        ),
                    new ButtonBuilder()
                        .setCustomId(Id.ChannelSelector)
                        .setLabel("Set Channel")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(Icons.Channel),
                    new ButtonBuilder()
                        .setEmoji(Icons.Emoji)
                        .setLabel("Set Reaction")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(Id.ReactionSelector)
                )
        ];

        const GenerateEmbed = () => {
            return new Embed(interaction)
                .setTitle("Managing Hightlights")
                .addFields([{
                    name: "About Highlights",
                    value: Module.Description
                }, {
                    name: "Current Configuration",
                    value: `
${TextBoolean(Status, "Highlights Status")}
${Icons.StemItem} Highlight Channel: ${Channel == null ? "None" : channelMention(Channel)}
${Icons.StemEnd} Highlight Reaction: ${Reaction == null ? "unknown" : Reaction}`
                }]);
        }

        const Save = async (editMessage = true) => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                StarboardStatus: Status,
                StarboardChannel: Channel,
                StarboardReaction: Reaction
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
            if (id == Id.Starboard) {
                Status = !Status
            }
        }

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
            if (button.customId == Id.ChannelSelector) {
                const { ChannelInteraction, SelectedChannel } = await selectChannel(button);

                Channel = SelectedChannel.id;
                await Save();
                await ChannelInteraction.update(Messages.Saved);
            } else if (button.customId == Id.Starboard) {
                let inter = button;
                let isChannelNull = Channel == null;
                if (Channel == null) {
                    const { ChannelInteraction, SelectedChannel } = await selectChannel(inter);
                    Channel = SelectedChannel.id;
                    inter = ChannelInteraction;
                    await Save();
                }

                HandleToggle(button.customId);
                await Save(isChannelNull);

                if (isChannelNull) {
                    await inter.update(Messages.Saved);
                } else {
                    await inter.update({
                        embeds: [
                            GenerateEmbed()
                        ],
                        components: Components()
                    })
                }
            } else if (button.customId == Id.ReactionSelector) {
                enum Fields {
                    Modal = "REACTION_MODAL",
                    Reaction = "REACTION"
                }

                const Field = new TextInputBuilder()
                    .setLabel("Reaction")
                    .setPlaceholder("This can be the name of any emoji in this server or a default")
                    .setValue(Reaction ?? undefined)
                    .setMinLength(1)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setCustomId(Fields.Reaction);

                const Modal = new ModalBuilder()
                    .setTitle("Highlights Reaction")
                    .setComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                Field
                            )
                    )
                    .setCustomId(Fields.Modal);

                await button.showModal(Modal);
                const modal = await button.awaitModalSubmit({
                    time: 0
                });

                const newReaction = modal.fields.getTextInputValue(Fields.Reaction);
                Reaction = newReaction;
                Save();
                modal.reply(Messages.Saved);
            }
        });

        ButtonCollector.AttachBackButton(Collector);
    }
}