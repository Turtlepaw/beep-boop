import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, RepliableInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Filter } from "../utils/filter";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import ms from "ms";
import { StartAutoDeleteService, StopAutoDeleteService } from "../utils/AutoDelete";

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
        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Continue")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("CONTINUE")
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
                filter: Filter(interaction.member, "CONTINUE"),
                componentType: ComponentType.Button
            });
        };

        const Menu = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("CHANNEL_SELECT")
                    .setMaxValues(10)
                    .setMinValues(1)
                    .addOptions(
                        interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText).map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.TextChannel)
                        )
                    )
            )

        const Message = await (interaction.replied ? Button : interaction).reply({
            content: "Let's start with the auto deleting channels.",
            components: [Menu],
            fetchReply: true
        });

        //const Message = await interaction.fetchReply();

        const SelectMenuInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            time: 0,
            filter: Filter(interaction.member, "CHANNEL_SELECT")
        });

        await SelectMenuInteraction.update({
            components: [Type],
            content: "When should the message be deleted?"
        });

        const TypeInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            time: 0,
            filter: Filter(interaction.member, "TYPE_SELECT")
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
                new Embed()
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