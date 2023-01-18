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
import { ChannelSelectMenu } from "../utils/components";
import { CleanupChannel } from "../utils/storage";

export default class BasicServerConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.ServerConfiguration
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client, values: string[]) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let Color = Configuration?.Color;

        enum Id {
            SetColorButton = "SET_COLOR",
            ColorModal = "SET_COLOR_MODAL",
            ColorField = "COLOR_MODAL_FIELD"
        }

        const Components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    BackComponent,
                    new ButtonBuilder()
                        .setCustomId(Id.SetColorButton)
                        .setLabel("Set Color")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(!Configuration.isPremium())
                )
        ];

        const GenerateEmbed = () => {
            return new Embed(interaction.guild)
                .setTitle(`Managing ${interaction.guild}`)
                .addFields([{
                    name: "About Server Settings",
                    value: `This provides basic server configuration. (e.g. color, moderation channel, etc...)`
                }, {
                    name: "Current Configuration",
                    value: `
${Icons.Dot} Color
${Icons.StemEnd} ${Color == null ? "None" : inlineCode(Color)}`
                }]).Resolve();
        }

        const Save = async (editMessage: boolean = true) => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                Color
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

        Collector.on("collect", async button => {
            if(button.customId == ButtonCollector.BackButton) return;
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
                await Message.edit({
                    embeds: [
                        await GenerateEmbed()
                    ],
                    components: Components()
                });
            }
        });

        ButtonCollector.AttachBackButton(Collector);
    }
}