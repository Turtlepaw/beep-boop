import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandSubcommandBuilder, time, TimestampStyles } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons } from "../configuration";
import { FriendlyInteractionError } from "../utils/error";
import ms from "ms";
import { generateId } from "../utils/Id";
import { Delete, FormatAll, Refresh } from "../utils/reminders";
import { Pages } from "utilsfordiscordjs";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Manage reminders.",
            GuildOnly: false,
            Name: "reminders",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Other,
            Subcommands: [
                new SlashCommandSubcommandBuilder()
                    .setName("list")
                    .setDescription("Show all your current reminders."),
                new SlashCommandSubcommandBuilder()
                    .setName("create")
                    .setDescription("Create a new reminder.")
                    .addStringOption(e =>
                        e.setName("title")
                            .setDescription("The title of the reminder.")
                            .setRequired(true)
                    )
                    .addStringOption(e =>
                        e.setName("time")
                            .setDescription("The time of the reminder. (e.g. 1d 5m 2s)")
                            .setRequired(true)
                    ),
                new SlashCommandSubcommandBuilder()
                    .setName("delete")
                    .setDescription("Remove that pesky reminder.")
                    .addStringOption(e =>
                        e.setName("id")
                            .setDescription("The ID of the reminder.")
                            .setRequired(true)
                    )
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        enum Subcommands {
            Delete = "delete",
            List = "list",
            Create = "create"
        }
        enum Options {
            Id = "id",
            Title = "title",
            Time = "time"
        }

        const Subcommand = interaction.options.getSubcommand() as Subcommands;

        if (Subcommand == Subcommands.Create) {
            const TimeRaw = interaction.options.getString(Options.Time);
            const Title = interaction.options.getString(Options.Title);
            const Time = ms(TimeRaw);
            const In = new Date(Date.now() + Time);
            const Id = generateId();
            client.Storage.Reminders.Create({
                Id: interaction.user.id,
                Title,
                Time,
                CustomId: Id,
                Reminded: false,
                CreatedAt: Date.now()
            });

            await interaction.reply({
                content: `${Icons.Success} Created a reminder, you'll be reminded ${time(In, TimestampStyles.RelativeTime)}`,
                ephemeral: true,
                embeds: [
                    new Embed(interaction.guild)
                        .setDescription(`Manage your reminder with \`${Id}\`.`)
                        .setFooter({
                            text: Title
                        })
                ]
            });

            await Refresh(client);
        } else if (Subcommand == Subcommands.Delete) {
            const Id = interaction.options.getString(Options.Id);
            Delete(Id, client);
            await interaction.reply({
                content: `${Icons.Success} Deleted the reminder under the Id of \`${Id}\``,
                ephemeral: true
            });
        } else if (Subcommand == Subcommands.List) {
            const Reminders = await FormatAll(client);

            if (Reminders == null || Reminders.length == 0) {
                await FriendlyInteractionError(interaction, "You don't have any reminders yet, try creating one!")
                return;
            }

            const PageEmbeds: EmbedBuilder[] = [];
            const BaseEmbed = new Embed(interaction.guild)
                .setTitle(`${Icons.Clock} Reminders`);

            const Max = 5;
            let At = 0;
            let CurrentEmbed = new EmbedBuilder(BaseEmbed.data);
            let FieldsAdded = 0;
            for (const Reminder of Reminders) {
                if (At == Max) {
                    At = 0;
                    PageEmbeds.push(CurrentEmbed)
                    CurrentEmbed = new EmbedBuilder(BaseEmbed.data);
                    continue;
                }

                //const CreatedAt = new Date(Reminder.CreatedAt);
                const In = new Date((Reminder.CreatedAt + Reminder.Time));
                CurrentEmbed.addFields([{
                    name: Reminder.Title,
                    value: `${time(In, TimestampStyles.RelativeTime)}`
                }]);

                FieldsAdded++

                if (FieldsAdded == (Reminders.length == 1 ? Reminders.length : (Reminders.length - 1))) {
                    PageEmbeds.push(CurrentEmbed);
                }

                At++
            }

            new Pages()
                .setEmbeds(PageEmbeds)
                .send(interaction);
        }
    }
}