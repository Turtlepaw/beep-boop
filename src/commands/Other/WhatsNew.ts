import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";

export default class WhatsNew extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "What has Discord been up to?",
            GuildOnly: false,
            Name: "whats_new",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Other
        });
    }

    async ExecuteCommand(interaction: CommandInteraction) {
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Modals")
                    .setEmoji("📜")
                    .setCustomId("test_modals"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Channel, roles, and user select menus")
                    .setEmoji("👆")
                    .setCustomId("test_new_selects"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Thread Channels")
                    .setEmoji("🧵")
                    .setCustomId("test_threads"),
            );

        await interaction.reply({
            content: "Let's see what Discord's been up to!",
            components: [Buttons]
        })
    }
}