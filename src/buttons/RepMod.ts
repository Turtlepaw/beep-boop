import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, RepliableInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextBasedChannel, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Filter } from "../utils/filter";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis, Icons } from "../configuration";
import Button from "../lib/ButtonBuilder";
import ms from "ms";
import { StartAutoDeleteService, StopAutoDeleteService } from "../utils/AutoDelete";
import { ChannelSelectMenu } from "../utils/components";
import { ReputationBasedModerationType } from "../models/Configuration";
import { JSONArray } from "../utils/jsonArray";

export interface RepMod {
    WarnChannel: string;
    BanAfter: number;
    isBan: boolean;
    isWarn: boolean;
}

export default class SetupAppeals extends Button {
    constructor() {
        super({
            CustomId: "REPUTATION_BASED_MODERATION",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const CurrentSettings = await client.Storage.Configuration.forGuild(interaction.guild);
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
                            .setLabel("Ban")
                            .setValue("BAN_AFTER"),
                        new SelectMenuOptionBuilder()
                            .setLabel("Warn Moderators")
                            .setValue("WARN"),
                    ])
                    .setCustomId("TYPE_SELECT")
                    .setMinValues(1)
                    .setMaxValues(2)
            );

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

        const ChannelMenu = ChannelSelectMenu("CHANNEL_SELECT", interaction.guild.channels.cache);

        const reply = (interaction.replied ? Button : interaction);
        const Message = await reply.reply({
            content: "Select an option",
            components: [Type],
            fetchReply: true
        });

        //const Message = await interaction.fetchReply();

        const SelectMenuInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            time: 0,
            filter: Filter(interaction.member, "TYPE_SELECT")
        });

        let btn: RepliableInteraction = SelectMenuInteraction;
        const isBan = SelectMenuInteraction.values.includes("BAN_AFTER");
        const isWarn = SelectMenuInteraction.values.includes("WARN");
        let WarnChannel: string;
        let Ban: string;
        if (isWarn) {
            const message = await btn.reply({
                content: "Select a warn channel",
                components: [ChannelMenu],
                fetchReply: true
            });

            const select = await message.awaitMessageComponent({
                componentType: ComponentType.StringSelect,
                time: 0,
                filter: Filter(interaction.member, "CHANNEL_SELECT")
            });

            btn = select;
            WarnChannel = select.values[0];
        }

        if (isBan) {
            await btn.showModal(
                new ModalBuilder()
                    .setComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setMaxLength(2)
                                    .setMinLength(1)
                                    .setRequired(true)
                                    .setLabel("Reputation Required (Set to 0 for none)")
                                    .setCustomId("REP")
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                            )
                    )
            );

            const modal = await btn.awaitModalSubmit({
                time: 0
            });

            btn = modal;
            Ban = modal.fields.getTextInputValue("REP");
        }

        let int: RepliableInteraction = btn;

        client.Storage.Configuration.Create({
            ModerationChannel: WarnChannel,
            MaxReputation: Number(Ban),
            ModerationType: new JSONArray().push([
                ...(isBan ? [ReputationBasedModerationType.AsBan] : []),
                ...(isWarn ? [ReputationBasedModerationType.AsWarn] : []),
            ]).toJSON()
        });

        await int.reply({
            embeds: [
                new Embed()
                    .setTitle(`${Icons.Shield} You're all set!`)
                    .setDescription(`Reputation Based Moderation has been set up.`)
                /*.addFields([{
                    name: "Setup",
                    value: `Messages in ${SelectMenuInteraction.values.map(e => `<#${e}>`)} will be deleted ${isAfterTime ? `after ${ms(AfterTime)}` : ``} ${isAfterLeave ? (
                        isAfterTime ? `and ` : ``
                    ) : ``}${isAfterLeave ? `after the author leaves` : ``}`
                }])*/
            ]
        });
    }
}