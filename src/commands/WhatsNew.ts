import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, CommandInteraction } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed } from "../configuration";

export default class WhatsNew extends Command {
    constructor() {
        super({
            CanaryCommand: true,
            Description: "What has Discord been up to?",
            GuildOnly: false,
            Name: "whats_new",
            RequiredPermissions: [],
            SomePermissions: []
        });
    }

    async ExecuteCommand(interaction: CommandInteraction, client: Client) {
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