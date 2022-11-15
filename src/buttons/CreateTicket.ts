import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, PermissionsBitField, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../utils/Id";
import { Filter } from "../utils/filter";

export interface Ticket {
    CreatedBy: string;
    CreatedAt: Date;
    ClosedBy?: string;
    ClosedAt: Date;
    ChannelId: string;
    GuildId: string;
    Reason: string;
}

export default class CreateTicket extends Button {
    constructor() {
        super({
            CustomId: "OPEN_TICKET",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ADD_REASON")
                    .setEmoji("👆")
                    .setLabel("Add Reason")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("SKIP")
                    .setLabel("Skip")
                    .setStyle(ButtonStyle.Secondary),
            );
        const Modal = new ModalBuilder()
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel("Reason")
                            .setCustomId("REASON")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                    )
            )
            .setTitle("Reason")
            .setCustomId("REASON_MODAL");

        const Channel = await interaction.guild.channels.fetch(client.storage[`${interaction.guild.id}_tickets`]);
        if (Channel.type != ChannelType.GuildCategory) {
            await interaction.reply({
                content: "Tickets haven't been setup properly in this server, contact server moderators about this.",
                ephemeral: true
            });
            return;
        }

        const Message = await interaction.reply({
            embeds: [
                new Embed()
                    .setColor(Colors.Blurple)
                    .setTitle(`${Emojis.Reason} Add a Reason`)
                    .setDescription("If you add a reason, you're more likely to get help faster.")
            ],
            components: [Buttons],
            fetchReply: true,
            ephemeral: true
        });

        const ButtonInteraction = await interaction.channel.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter(interaction.member, "ADD_REASON", "SKIP")
        });

        let Reason = "None provided.";
        let Interaction: ModalSubmitInteraction | ButtonInteraction = ButtonInteraction;
        if (ButtonInteraction.customId == "ADD_REASON") {
            ButtonInteraction.showModal(Modal);
            const ModalInteraction = await ButtonInteraction.awaitModalSubmit({
                time: 0
            });

            Reason = ModalInteraction.fields.getTextInputValue("REASON");
            Interaction = ModalInteraction;
        }

        const TicketChannel = await Channel.children.create({
            name: `ticket-${interaction.user.username}`,
            topic: `Created by ${interaction.user.tag}`,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                }
            ],
            type: ChannelType.GuildText
        });

        TicketChannel.send({
            embeds: [
                new Embed()
                    .setTitle(`Ticket`)
                    .addFields([{
                        name: "Created At",
                        value: time(new Date(), TimestampStyles.RelativeTime),
                        inline: true
                    }, {
                        name: "Created By",
                        value: interaction.user.toString(),
                        inline: true
                    }, {
                        name: "Reason",
                        value: Reason,
                        inline: true
                    }, {
                        name: "Claimed By",
                        value: "No one has claimed this ticket yet.",
                        inline: true
                    }])
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Close")
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("🔒")
                            .setCustomId("CLOSE_TICKET"),
                        new ButtonBuilder()
                            .setLabel("Claim")
                            .setStyle(ButtonStyle.Success)
                            .setEmoji("🔍")
                            .setCustomId("CLAIM_TICKET")
                    )
            ]
        });

        await Interaction.reply({
            ephemeral: true,
            content: `${Emojis.Success} Created a ticket in ${TicketChannel}`
        });

        await interaction.editReply({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        Buttons.components.map(e => e.setDisabled(true))
                    )
            ]
        });

        client.storage[`ticket_${TicketChannel.id}`] = {
            CreatedBy: interaction.user.id,
            CreatedAt: new Date(),
            ClosedBy: null,
            ClosedAt: null,
            ChannelId: TicketChannel.id,
            GuildId: interaction.guild.id,
            Reason
        }
    }
}