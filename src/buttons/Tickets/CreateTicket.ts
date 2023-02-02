import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, ModalBuilder, ModalSubmitInteraction, PermissionsBitField, TextInputBuilder, TextInputStyle, time, TimestampStyles } from "discord.js";
import { Embed, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { Filter } from "../../utils/filter";

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
        enum Id {
            AddReason = "ADD_REASON_TICKET",
            SkipReason = "SKIP_ADD_REASON_TICKET"
        }

        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(Id.AddReason)
                    //.setEmoji(Icons.Flag)
                    .setLabel("Add Reason")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(Id.SkipReason)
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

        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        const Channel = Configuration?.Tickets?.Category == null ? null : await interaction.guild.channels.fetch(Configuration.Tickets.Category);
        if (Channel?.type != ChannelType.GuildCategory) {
            await interaction.reply({
                content: `${Icons.Folder} Tickets haven't been setup properly in this server, contact server managers about this.`,
                ephemeral: true
            });
            return;
        }

        const Message = await interaction.reply({
            embeds: [
                new Embed(interaction.guild)
                    .setTitle(`${Icons.Flag} Add a Reason`)
                    .setDescription("If you add a reason, you're more likely to get help faster.")
            ],
            components: [Buttons],
            fetchReply: true,
            ephemeral: true
        });

        const ButtonInteraction = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter({
                member: interaction.member,
                customIds: Id
            })
        });

        let Reason = "No reason provided";
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
            topic: `This ticket has been created by ${interaction.user.tag} (${interaction.user.toString()}) for the following reason: ${Reason}`,
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
                new Embed(interaction.guild)
                    .setTitle(`Ticket`)
                    .setAuthor({
                        name: `Created By ${interaction.user.username}`,
                        iconURL: interaction.user.avatarURL()
                    })
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
                        value: "No one has claimed this ticket yet",
                        inline: true
                    }])
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Close")
                            .setStyle(ButtonStyle.Danger)
                            //.setEmoji(Icons.Lock)
                            .setCustomId("CLOSE_TICKET"),
                        new ButtonBuilder()
                            .setLabel("Claim")
                            .setStyle(ButtonStyle.Success)
                            //.setEmoji(Icons.Sync)
                            .setCustomId("CLAIM_TICKET")
                    )
            ]
        });

        await Interaction.reply({
            ephemeral: true,
            content: `${Icons.Success} Created a ticket in ${TicketChannel}`
        });

        await interaction.editReply({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        Buttons.components.map(e => e.setDisabled(true))
                    )
            ]
        });

        client.Storage.Tickets.Create({
            CreatedBy: interaction.user.id,
            CreatedAt: new Date(),
            ClosedBy: null,
            ClosedAt: null,
            ChannelId: TicketChannel.id,
            GuildId: interaction.guild.id,
            Reason,
            //add default message
            Messages: new Map(),
            Creator: {
                //add this in
            }
        });
    }
}