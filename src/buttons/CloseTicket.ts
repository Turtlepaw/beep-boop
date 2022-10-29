import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { SendError } from "../error";
import { Verifiers } from "../verify";
import { SendAppealMessage } from "../appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../Id";
import { Ticket } from "./CreateTicket";

export default class TestAppeals extends Button {
    constructor() {
        super({
            CustomId: "CLOSE_TICKET",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["ManageChannels"]
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

        const OldTicket: Ticket = client.storage[`ticket_${interaction.channel.id}`];
        client.storage[`ticket_${interaction.channel.id}`] = {
            CreatedBy: OldTicket.CreatedBy,
            CreatedAt: OldTicket.CreatedAt,
            ClosedBy: interaction.user.id,
            ClosedAt: new Date(),
            ChannelId: interaction.channel.id,
            GuildId: interaction.guild.id,
            Reason: OldTicket.Reason
        }
        const ticket: Ticket = client.storage[`ticket_${interaction.channel.id}`];
        const Category = await interaction.guild.channels.fetch(client.storage[`${interaction.guild.id}_tickets`]);
        if (Category.type != ChannelType.GuildCategory) {
            await interaction.reply("Something didn't go right, contact the server owner about this.");
            return;
        }

        const Message = await interaction.reply({
            embeds: [
                new Embed()
                    .setColor(Colors.Blurple)
                    .setTitle("⚠️ Add a Reason")
                    .setDescription("Would you like to add a reason to this?")
            ],
            components: [Buttons],
            fetchReply: true,
            ephemeral: true
        });

        const ButtonInteraction = await interaction.channel.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button
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

        const LogChannel = Category.children.cache.find(e => e.name == "logs");

        if (LogChannel.type != ChannelType.GuildText) {
            await interaction.reply("Something didn't go right, contact the server owner about this.");
            return;
        };

        LogChannel.send({
            embeds: [
                new Embed()
                    .setTitle(`Ticket Closed`)
                    .setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: "Closed By " + interaction.user.username
                    })
                    .addFields([{
                        name: "Created At",
                        value: time(ticket.CreatedAt, TimestampStyles.RelativeTime),
                        inline: true
                    }, {
                        name: "Created By",
                        value: `<@${ticket.CreatedBy}>`,
                        inline: true
                    }, {
                        name: "Closed At",
                        value: time(ticket.ClosedAt, TimestampStyles.RelativeTime),
                        inline: true
                    }, {
                        name: "Closed By",
                        value: `<@${ticket.ClosedBy}>`,
                        inline: true
                    }, {
                        name: "Close Reason",
                        value: `${Reason}`,
                        inline: true
                    }, {
                        name: "Ticket Reason",
                        value: `${ticket.Reason}`,
                        inline: true
                    }])
            ]
        });

        await Interaction.reply({
            ephemeral: true,
            content: `Closed ticket successfully.`
        });
    }
}