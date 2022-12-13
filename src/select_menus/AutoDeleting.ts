import { ActionRow, ActionRowBuilder, AnySelectMenuInteraction, bold, ButtonBuilder, ButtonStyle, Client, Colors, CommandInteraction, inlineCode, ModalBuilder, PermissionsBitField, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons, Messages } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, TextBoolean } from "../utils/config";
import ms from "ms";
import { Filter } from "../utils/filter";
import { DisableButtons, ResolvedComponent, ResolveComponent } from "@airdot/activities/dist/utils/Buttons";
import { CleanupType } from "../models/Configuration";
import { JSONArray } from "../utils/jsonArray";
import { Modules } from "../commands/Server";

export default class AutonomousCleaning extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"],
            Value: Modules.AutonomousCleanup
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client, values: string[]) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let SystemCleanup = Configuration.isSystemCleanup();
        let MessageCleanup = Configuration.isMessageCleanup();
        let TimedCleanup = Configuration.isTimedCleanup();
        let Timer = Configuration?.CleanupTimer;

        enum Id {
            TimedCleanup = "timed_cleanup",
            MessageCleanup = "message_cleanup",
            SystemCleanup = "system_cleanup",
            TimeModal = "timer_modal",
            TimeField = "timer_field"
        }

        const Components = () => [
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
        ];
        const GenerateEmbed = () => new Embed()
            .setTitle("Managing Autonomous Cleanup")
            .addFields([{
                name: "About Autonomous Cleanup Module",
                value: `Autonomous Cleanup can cleanup old messages like member's message if they've left or if they left the server their system welcome message will be deleted.`
            }, {
                name: "Current Configuration",
                value: `
${TextBoolean(SystemCleanup, "System Cleanup")}
${TextBoolean(MessageCleanup, "Message Cleanup")}
${TextBoolean(TimedCleanup, "Timed Cleanup")}
${Icons.StemEnd} Deletes after: ${Timer == null ? "Nothing set." : ms(Timer)}`
            }]);

        const Save = async () => {
            await client.Storage.Configuration.Edit({
                Id: Configuration.Id
            }, {
                CleanupType: new JSONArray().push(...[
                    ...(SystemCleanup ? [CleanupType.System] : []),
                    ...(MessageCleanup ? [CleanupType.Message] : []),
                    ...(TimedCleanup ? [CleanupType.Timed] : [])
                ]).toJSON(),
                CleanupTimer: TimedCleanup ? Timer : null
            });
        }

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

        const Collector = Message.createMessageComponentCollector({
            time: 0,
            filter: Filter(interaction.member, Id.MessageCleanup, Id.SystemCleanup, Id.TimedCleanup)
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

        Collector.on("collect", async button => {
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
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                BackComponent,
                                ...Components()
                            )
                    ]
                })
            } else {
                HandleToggle(button.customId);
                await Save();
                await button.update({
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
                })
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