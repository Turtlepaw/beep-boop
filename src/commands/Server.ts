import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, Colors, CommandInteraction, Interaction, PermissionsBitField, RepliableInteraction, SelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons } from "../configuration";

export function ServerConfiguration(interaction: RepliableInteraction) {
    const Buttons = [
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ADD_AS_BIRTHDAY")
                    .setLabel("Add Birthday as Event")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel("Error Logs")
                    .setEmoji("⚠️")
                    .setCustomId("ERROR_LOG")
                    .setStyle(ButtonStyle.Secondary)
            ),
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("ConfigureMenu")
                    .setPlaceholder("Configure an module")
                    .setMaxValues(1)
                    .addOptions(
                        new SelectMenuOptionBuilder()
                            .setLabel("Appeals")
                            .setEmoji(Icons.Discover)
                            .setValue("SETUP_APPEALS"),
                        new SelectMenuOptionBuilder()
                            .setValue("SETUP_TICKETS")
                            .setLabel("Tickets")
                            .setEmoji(Icons.Flag),
                        new SelectMenuOptionBuilder()
                            .setValue("MODERATOR_SETTINGS")
                            .setLabel("Autonomous Moderation")
                            .setEmoji(Icons.Shield),
                        new SelectMenuOptionBuilder()
                            .setValue("SERVER_SETTINGS")
                            .setLabel("Server")
                            .setEmoji(Icons.Configure),
                        new SelectMenuOptionBuilder()
                            .setValue("AUTO_DELETE_SETTINGS")
                            .setLabel("Autonomous Cleanup")
                            .setEmoji(Icons.Trash),
                        new SelectMenuOptionBuilder()
                            .setValue("REPUTATION_BASED_MODERATION")
                            .setLabel("Reputation Based Moderation")
                            .setEmoji(Icons.Lock)
                    )
            )
    ];

    const payload = {
        embeds: [
            new Embed()
                .setTitle(`Managing ${interaction.guild.name}`)
                .setColor(Colors.Blurple)
                .setDescription(`Since you're managing ${interaction.guild.name}, you're able to use Beep Boop's \`/server\` command, that allows you to use multiple util actions.`)
        ],
        components: Buttons
    }

    if (interaction.deferred || interaction.replied) {
        //@ts-expect-error
        if (interaction?.update != null) {
            //@ts-expect-error
            return interaction.update(payload)
        } else {
            return interaction.editReply(payload)
        }
    } else return interaction.reply(payload);
}

export default class Server extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Manage the server's settings.",
            GuildOnly: false,
            Name: "configuration",
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"],
            Category: Categories.Server
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        if (interaction.inCachedGuild() /*&& interaction.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)*/) {
            await ServerConfiguration(interaction);
        } else {

        }
    }
}