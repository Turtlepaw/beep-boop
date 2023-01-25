import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { Icons, Permissions } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { AdvancedButtonId } from "../../commands/Guild/Server";

export default class AdvancedConfiguration extends Button {
    constructor() {
        super({
            CustomId: AdvancedButtonId,
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        const Buttons = [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Try Appeal System")
                        .setEmoji(Icons.Discover)
                        .setCustomId("TEST_APPEALS")
                        .setStyle(ButtonStyle.Secondary)
                )
        ]

        await interaction.reply({
            content: `${Icons.Configure} Showing advanced configuration options.`,
            components: Buttons
        });
    }
}