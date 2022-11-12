import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { SupportServerInvite } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class SupportServer extends Button {
    constructor() {
        super({
            CustomId: "REDIRECT_SUPPORT_SERVER",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const LinkButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(SupportServerInvite)
                    .setLabel("Support Server")
            );

        await interaction.reply({
            content: "You'll be redirected to an external server, are you sure?",
            components: [LinkButtons],
            ephemeral: true
        });
    }
}