import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteraction, ComponentType, OAuth2Scopes, PermissionFlagsBits, SharedSlashCommandOptions, SlashCommandChannelOption } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed, Emojis } from "../configuration";
import { Filter } from "../utils/filter";
import { EmbedFrom, EmbedModal } from "../utils/components";
import { FriendlyInteractionError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { CreateLinkButton } from "../utils/buttons";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: true,
            Description: "Send a message as Beep Boop.",
            GuildOnly: false,
            Name: "send",
            RequiredPermissions: [],
            SomePermissions: ["ManageGuild"],
            Options: [
                new SlashCommandChannelOption()
                    .setName("channel")
                    .setDescription("The channel to send the message.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        const Channel = interaction.options.getChannel("channel", false) || interaction.channel;

        if (Channel.type != ChannelType.GuildText) return FriendlyInteractionError(interaction, "Channel must be a text channel.")
        if (!Verifiers.TextChannel(Channel)) return FriendlyInteractionError(interaction, "API Channel recived")

        enum CustomId {
            AsMessage = "AS_MESSAGE_CONTENT",
            ASEmbed = "AS_EMBED_BUILDER"
        }
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(CustomId.AsMessage)
                    .setLabel("As Message"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(CustomId.ASEmbed)
                    .setLabel("As Embed"),
            );

        const Message = await interaction.reply({
            content: "Select an option below.",
            components: [Buttons],
            fetchReply: true,
            ephemeral: true
        });

        const Button = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter(interaction.member, CustomId.AsMessage, CustomId.ASEmbed)
        });

        interaction.editReply({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        //@ts-expect-error
                        Button.message.components[0].components.map(e => ButtonBuilder.from(e).setDisabled(true))
                    )
            ]
        });

        if (Button.customId == CustomId.ASEmbed) {
            await Button.showModal(
                EmbedModal()
            );

            const Modal = await Button.awaitModalSubmit({
                time: 0
            });

            const ModalEmbed = EmbedFrom(Modal);
            const SentMessage = await Channel.send({
                embeds: [
                    ModalEmbed
                ]
            });

            client.Storage.Create("custom_messages", [
                ...client.Storage.Get("custom_messages"),
                SentMessage.id
            ]);

            await Modal.reply({
                content: `${Emojis.Success} Successfully sent embed`,
                ephemeral: true,
                components: [
                    CreateLinkButton(SentMessage.url, "Message")
                ]
            });
        }
    }
}