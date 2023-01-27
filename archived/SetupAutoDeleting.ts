//@ts-nocheck
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, RepliableInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Filter } from "../src/utils/filter";
import { SendAppealMessage } from "../src/utils/appeals";
import { Embed, Emojis } from "../src/configuration";
import Button from "../src/lib/ButtonBuilder";
import ms from "ms";
import { StartAutoDeleteService, StopAutoDeleteService } from "../src/utils/AutoDelete";
import { ChannelSelectMenu } from "../src/utils/components";

export default class SetupAppeals extends Button {
    constructor() {
        super({
            CustomId: "AUTO_DELETE_SETTINGS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const CurrentSettings = client.Storage.Configuration.forGuild(interaction.guild);
        let Button: ButtonInteraction;
        enum Id {
            Continue = "CONTIUE_OVERWRITE_SAVED_DATA_AD",
            ChannelSelector = "SELECT_A_CHANNEL_AD",
            TypeSelector = "SELECT_A_TYPE_AD"
        }
        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Continue")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(Id.Continue)
            )

        const Type = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .addOptions([
                        new SelectMenuOptionBuilder()
                            .setLabel("After specific time")
                            .setValue("AFTER_TIME"),
                        new SelectMenuOptionBuilder()
                            .setLabel("After member leaves")
                            .setValue("AFTER_LEAVE"),
                    ])
                    .setCustomId("TYPE_SELECT")
                    .setMinValues(1)
                    .setMaxValues(2)
            )

        if (CurrentSettings != null) {
            const ActionMessage = await interaction.reply({
                content: "If you continue you'll overwrite your current settings, are you sure you want to continue?",
                components: [ActionButtons],
                fetchReply: true
            });

            Button = await ActionMessage.awaitMessageComponent({
                time: 0,
                filter: Filter({
                    member: interaction.member,
                    customIds: Id
                }),
                componentType: ComponentType.Button
            });
        }

        const Menu = ChannelSelectMenu(Id.ChannelSelector);

        const Message = await (interaction.replied ? Button : interaction).reply({
            content: "Let's start with the auto deleting channels.",
            components: [Menu],
            fetchReply: true
        });

        //const Message = await interaction.fetchReply();

        const SelectMenuInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: Id
            })
        });

        await SelectMenuInteraction.update({
            components: [Type],
            content: "When should the message be deleted?"
        });

        const TypeInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: Id
            })
        });

        let int: RepliableInteraction = TypeInteraction;
        const isAfterTime = TypeInteraction.values.includes("AFTER_TIME");
        const isAfterLeave = TypeInteraction.values.includes("AFTER_LEAVE");
        if (isAfterTime) {
            await TypeInteraction.showModal(
                new ModalBuilder()
                    .setTitle("Selecting Time")
                    .setCustomId("TIME_MODAL")
                    .setComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .setComponents(
                                new TextInputBuilder()
                                    .setCustomId("TIME")
                                    .setLabel("Time (e.g. 5m 2s)")
                                    .setPlaceholder("5m 2s")
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(2)
                            )
                    )
            );

            int = await TypeInteraction.awaitModalSubmit({
                time: 0
            });
        }

        const AfterTime = int.isModalSubmit() ? ms(int.fields.getTextInputValue("TIME")) : null;
        if (SelectMenuInteraction?.values.length >= 1) client.Storage.Configuration.AddChannel(SelectMenuInteraction.values, interaction.guild.id);
        if (AfterTime != null) {
            client.Storage.Configuration.Edit({ Id: interaction.guild.id }, {
                CleanupTimer: AfterTime
            })
        }

        await int.reply({
            embeds: [
                new Embed(interaction.guild)
                    .setTitle(`${Emojis.Tada} You're all set!`)
                    .setDescription(`Auto deleting has been set up! When members leave and they've sent a message in one or more of those channels, it will be deleted.`)
                    .addFields([{
                        name: "Setup",
                        value: `Messages in ${SelectMenuInteraction.values.map(e => `<#${e}>`)} will be deleted ${isAfterTime ? `after ${ms(AfterTime)}` : ``} ${isAfterLeave ? (
                            isAfterTime ? `and ` : ``
                        ) : ``}${isAfterLeave ? `after the author leaves` : ``}`
                    }])
            ]
        });

        // Restart auto delete service
        StopAutoDeleteService();
        StartAutoDeleteService(client);
    }
}