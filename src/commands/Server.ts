import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, CommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed } from "../configuration";

export default class Server extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get information about the server.",
            GuildOnly: false,
            Name: "server",
            RequiredPermissions: [],
            SomePermissions: []
        });
    }

    async ExecuteCommand(interaction: CommandInteraction, client: Client) {
        if (interaction.inCachedGuild() && interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const Buttons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Add Birthday as Event")
                        .setCustomId("ADD_AS_BIRTHDAY")
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.reply({
                embeds: [
                    new Embed()
                        .setTitle(`Managing ${interaction.guild.name}`)
                        .setColor(Colors.Blurple)
                        .setDescription(`Since you're managing ${interaction.guild.name}, you're able to use Beep Boop's \`/server\` command, that allows you to use multiple util actions.`)
                ],
                components: [Buttons]
            });
        } else {

        }
    }
}