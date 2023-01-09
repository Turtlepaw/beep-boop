import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, codeBlock, Colors, CommandInteraction, PermissionsBitField } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons, Permissions } from "../configuration";
import { Logger } from "../logger";
import fs from "fs";
import Button from "../lib/ButtonBuilder";
import { DeveloperPortal } from "../commands/Help";
import { AdvancedButtonId } from "../commands/Server";

export default class AdvancedConfiguration extends Button {
    constructor() {
        super({
            CustomId: AdvancedButtonId,
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
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