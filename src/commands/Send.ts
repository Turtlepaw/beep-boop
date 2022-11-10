import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, CommandInteraction, OAuth2Scopes, PermissionFlagsBits } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed } from "../configuration";

export default class Help extends Command {
    constructor() {
        super({
            CanaryCommand: true,
            Description: "Send a message as Beep Boop.",
            GuildOnly: false,
            Name: "send",
            RequiredPermissions: [],
            SomePermissions: ["ManageGuild"]
        });
    }

    async ExecuteCommand(interaction: CommandInteraction, client: Client) {
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
            fetchReply: true
        });
    }
}