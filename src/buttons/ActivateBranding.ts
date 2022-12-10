import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, Colors, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis, GenerateTranscriptionURL } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { generateId } from "../utils/Id";
import { Ticket } from "./CreateTicket";
import { Filter } from "../utils/filter";
import { CreateLinkButton } from "../utils/buttons";

export const CustomBrandingModal = "CUSTOM_BRANDING_MODAL";
export default class CustomBranding extends Button {
    constructor() {
        super({
            CustomId: "CUSTOM_BRANDING",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Message = await interaction.reply({
            ephemeral: true,
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("CONTINUE")
                    )
            ],
            fetchReply: true,
            content: "Before you continue, make sure you've got your custom bot ready, if you don't know how to do that, check out the [guide](https://bop.trtle.xyz/learn/custom-bots)."
        });

        const Interaction = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button
        });

        await Interaction.showModal(
            new ModalBuilder()
                .setTitle("Configuring Custom Branding")
                .setCustomId(CustomBrandingModal)
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId("TOKEN")
                                .setLabel("Bot Token")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder("NzkyNzE1NDU0MTk2MDg4ODQy.X-hvzA.Ovy4MCQywSkoMRRclStW4xAYK7I")
                                .setMinLength(59)
                                .setMaxLength(72)
                        )
                )
        );
    }
}