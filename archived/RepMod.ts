//@ts-nocheck
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, ComponentType, ModalBuilder, RepliableInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Filter } from "../src/utils/filter";
import { Embed, Icons } from "../src/configuration";
import Button from "../src/lib/ButtonBuilder";
import { ChannelSelectMenu } from "../src/utils/components";
import { ReputationBasedModerationType } from "../src/models/Configuration";
import { JSONArray } from "../src/utils/jsonArray";

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
        enum Id {
            Continue = "CONTINUE",
            ActionBan = "BAN_ACTION_REPMOD",
            ActionWarn = "WARN_ACTION_REPMOD",
            ActionSelector = "SELECT_AN_ACTION",
            ChannelSelector = "SELECT_A_CHANNEL"
        }
        const CurrentSettings = await client.Storage.Configuration.forGuild(interaction.guild);
        let Button: ButtonInteraction;
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
                            .setLabel("Ban")
                            .setValue(Id.ActionBan),
                        new SelectMenuOptionBuilder()
                            .setLabel("Warn Moderators")
                            .setValue(Id.ActionWarn)
                    ])
                    .setCustomId(Id.ActionSelector)
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
                filter: Filter({
                    member: interaction.member,
                    customIds: Id
                }),
                componentType: ComponentType.Button
            });
        }

        const ChannelMenu = ChannelSelectMenu(Id.ChannelSelector, interaction.guild.channels.cache);

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
            filter: Filter({
                member: interaction.member,
                customIds: Id
            })
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
                filter: Filter({
                    member: interaction.member,
                    customIds: Id
                })
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

        const int: RepliableInteraction = btn;

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
                new Embed(interaction.guild)
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