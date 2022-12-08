import { ActionRow, ActionRowBuilder, AnySelectMenuInteraction, bold, ButtonBuilder, ButtonStyle, Client, Colors, CommandInteraction, inlineCode, ModalBuilder, PermissionsBitField, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, TextBoolean } from "../utils/config";
import ms from "ms";
import { Filter } from "src/utils/filter";
import { DisableButtons, ResolvedComponent, ResolveComponent } from "@airdot/activities/dist/utils/Buttons";

export default class AutonomousCleaning extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"],
            Value: "AUTO_DELETE_SETTINGS"
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client, values: string[]) {
        let SystemCleanup = false;
        let MessageCleanup = false;
        let TimedCleanup = false;
        let Timer = 50000;

        enum Id {
            TimedCleanup = "timed_cleanup",
            MessageCleanup = "message_cleanup",
            SystemCleanup = "system_cleanup",
            TimeModal = "timer_modal",
            TimeField = "timer_field"
        }

        const Message = await interaction.update({
            fetchReply: true,
            embeds: [
                new Embed()
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
└ Deletes after: ...`
                    }])
            ],
            components: [
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
                    )
            ]
        });

        const Collector = Message.createMessageComponentCollector({
            time: 0,
            filter: Filter(interaction.member, Id.MessageCleanup, Id.SystemCleanup, Id.TimedCleanup)
        });

        function HandleToggle(id: Id) {
            if (id == Id.MessageCleanup) {
                MessageCleanup = !MessageCleanup
            } else if (id == Id.SystemCleanup) {
                SystemCleanup = !SystemCleanup
            }
        }
        Collector.on("collect", async button => {
            if (button.customId == Id.MessageCleanup) {

            } else if (button.customId == Id.SystemCleanup) {

            } else if (button.customId == Id.TimedCleanup) {
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