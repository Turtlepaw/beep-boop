import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  Client,
  Colors,
  ComponentType,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  time,
  TimestampStyles,
} from "discord.js";
import { Embed, GenerateTranscriptionURL, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { Filter } from "../../utils/filter";
import { CreateLinkButton } from "../../utils/buttons";

export default class CloseTicket extends Button {
  constructor() {
    super({
      CustomId: "CLOSE_TICKET",
      GuildOnly: true,
      RequiredPermissions: [],
      SomePermissions: [
        "ManageChannels",
        "KickMembers",
        "ManageMessages",
        "BanMembers",
      ],
    });
  }

  async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
    const Configuration = await client.Storage.Configuration.forGuild(
      interaction.guild
    );
    enum Id {
      AddReason = "ADD_REASON_TICKET",
      SkipReason = "SKIP_ADD_REASON_TICKET",
    }

    const Buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(Id.AddReason)
        .setLabel("Add Reason")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(Id.SkipReason)
        .setLabel("Skip")
        .setStyle(ButtonStyle.Secondary)
    );
    const Modal = new ModalBuilder()
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setLabel("Reason")
            .setCustomId("REASON")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
        )
      )
      .setTitle("Reason")
      .setCustomId("REASON_MODAL");

    const OldTicket = await client.Storage.Tickets.FindOneBy({
      ChannelId: interaction.channel.id,
    });
    await client.Storage.Tickets.Edit(OldTicket.Entity, {
      ClosedBy: interaction.user.id,
      ClosedAt: new Date(),
      ChannelId: interaction.channel.id,
      GuildId: interaction.guild.id,
    });

    const ticket = await client.Storage.Tickets.FindOneBy({
      ChannelId: interaction.channel.id,
    });

    const Category = await interaction.guild.channels.fetch(
      Configuration.Tickets?.Category
    );

    if (Category.type != ChannelType.GuildCategory) {
      await interaction.reply(
        "Something didn't go right, contact the server owner about this."
      );
      return;
    }

    const Message = await interaction.reply({
      embeds: [
        new Embed(interaction)
          .setColor(Colors.Blurple)
          .setTitle(`${Icons.Flag} Add a Reason`)
          .setDescription("Would you like to add a reason to this?"),
      ],
      components: [Buttons],
      fetchReply: true,
      ephemeral: true,
    });

    const ButtonInteraction = await Message.awaitMessageComponent({
      time: 0,
      componentType: ComponentType.Button,
      filter: Filter({
        member: interaction.member,
        customIds: Id,
      }),
    });

    let Reason = "None provided.";
    let Interaction: ModalSubmitInteraction | ButtonInteraction =
      ButtonInteraction;
    if (ButtonInteraction.customId == Id.AddReason) {
      ButtonInteraction.showModal(Modal);
      const ModalInteraction = await ButtonInteraction.awaitModalSubmit({
        time: 0,
      });

      Reason = ModalInteraction.fields.getTextInputValue("REASON");
      Interaction = ModalInteraction;
    }

    const LogChannel = Category.children.cache.find((e) => e.name == "logs");

    if (LogChannel.type != ChannelType.GuildText) {
      await interaction.reply(
        "Something didn't go right, contact the server owner about this."
      );
      return;
    }

    LogChannel.send({
      embeds: [
        new Embed(interaction)
          .setTitle(`Ticket Closed`)
          .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: "Closed By " + interaction.user.username,
          })
          .addFields([
            {
              name: "Created",
              value: time(
                new Date(ticket.CreatedAt),
                TimestampStyles.RelativeTime
              ),
              inline: true,
            },
            {
              name: "Created By",
              value: `<@${ticket.CreatedBy}>`,
              inline: true,
            },
            {
              name: "Closed",
              value: time(
                new Date(ticket.ClosedAt),
                TimestampStyles.RelativeTime
              ),
              inline: true,
            },
            {
              name: "Closed By",
              value: `<@${ticket.ClosedBy}>`,
              inline: true,
            },
            {
              name: "Close Reason",
              value: `${Reason}`,
              inline: true,
            },
            {
              name: "Ticket Reason",
              value: `${ticket.Reason}`,
              inline: true,
            },
          ]),
      ],
      components: [
        CreateLinkButton(
          GenerateTranscriptionURL(
            interaction.guild.id,
            interaction.channel.id
          ),
          "Share this conversation or review it"
        ),
      ],
    });

    Interaction.channel.delete(`Ticket closed by: ${Interaction.user.tag}`);
    await Interaction.reply({
      ephemeral: true,
      content: `${Icons.DefaultTrash} Closed ticket successfully.`,
    });
  }
}
