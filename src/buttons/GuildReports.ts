import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, RepliableInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextBasedChannel, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Filter } from "../utils/filter";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis, Icons } from "../configuration";
import Button from "../lib/ButtonBuilder";
import ms from "ms";
import { StartAutoDeleteService, StopAutoDeleteService } from "../utils/AutoDelete";
import { ChannelSelectMenu } from "../utils/components";

export interface ReportConfig {
    ChannelId: string;
}

export default class SetupAppeals extends Button {
    constructor() {
        super({
            CustomId: "GUILD_REPORTS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const CurrentSettings = client.Storage.Get(`${interaction.guild.id}_report_conf`);
        let Button: ButtonInteraction;
        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Continue")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("CONTINUE")
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

        // const Menu = new ActionRowBuilder<SelectMenuBuilder>()
        //     .addComponents(
        //         new SelectMenuBuilder()
        //             .setCustomId("CHANNEL_SELECT")
        //             .setMaxValues(10)
        //             .setMinValues(1)
        //             .addOptions(
        //                 interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText).map(e =>
        //                     new SelectMenuOptionBuilder()
        //                         .setLabel(e.name)
        //                         .setValue(e.id)
        //                         .setEmoji(Emojis.TextChannel)
        //                 )
        //             )
        //     )

        const ChannelMenu = ChannelSelectMenu("CHANNEL_SELECT", interaction.guild.channels.cache);

        const reply = (interaction.replied ? Button : interaction);
        const Message = await reply.reply({
            content: "Select a channel",
            components: [ChannelMenu],
            fetchReply: true
        });

        const SelectMenuInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            time: 0,
            filter: Filter(interaction.member, "TYPE_SELECT")
        });

        let btn: RepliableInteraction = SelectMenuInteraction;
        const ChannelId = SelectMenuInteraction.values[0];
        const Channel = await interaction.guild.channels.fetch(ChannelId) as TextBasedChannel;

        client.Storage.Create<ReportConfig>(`${interaction.guild.id}_report_conf`, {
            ChannelId
        });

        Channel.send({
            content: `This channel has been set up to recieve member reports.`
        });

        await SelectMenuInteraction.reply({
            embeds: [
                new Embed()
                    .setTitle(`${Icons.Shield} You're all set!`)
                    .setDescription(`Member Reports have been set up, members will now be able to report messages.`)
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