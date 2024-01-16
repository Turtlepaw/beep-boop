import { inlineCode, AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandStringOption, time, TimestampStyles, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { FriendlyInteractionError } from "../../utils/error";
import { getScreenshot, ResolveURL } from "../../utils/Web";
import ms from "ms";
import { Icons } from "../../configuration";

export default class Send extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Get an image preview of a website.",
            GuildOnly: false,
            Name: "preview",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Information,
            Options: [
                new SlashCommandStringOption()
                    .setName("website")
                    .setDescription("The url of the website.")
                    .setRequired(true),
                new SlashCommandBooleanOption()
                    .setName("hidden")
                    .setDescription("Make the reply visible only to you and hidden to everyone else."),
                new SlashCommandStringOption()
                    .setName("delay")
                    .setDescription("Delay the screenshot, useful for websites that are loading.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        const Link = interaction.options.getString("website")
        const ephemeral = interaction.options.getBoolean("hidden") ?? true;
        const _delay = interaction.options.getString("delay");
        const Delay = _delay == null ? 0 : ms(_delay);
        const DelayDate = new Date(Date.now() + Delay + ms("1s"));
        const StartTime = Date.now();

        await interaction.reply({
            content: `${Icons.Image} ` + (Delay > 0 ? `Rendering page in ${time(DelayDate, TimestampStyles.RelativeTime)}` : `Opening page...`),
            ephemeral
        });

        try {
            const Preview = await getScreenshot(null, ResolveURL(Link), Delay, () => interaction.editReply({
                content: `${Icons.Image} Rendering page...`
            }));
            const Attachment = new AttachmentBuilder(Preview.buffer);
            const TimeTook = Date.now() - StartTime;

            await interaction.editReply({
                files: [Attachment],
                content: `${Icons.Success} Rendered page in ${inlineCode(TimeTook.toString() + "ms")}`,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Open Page")
                                .setStyle(ButtonStyle.Link)
                                .setEmoji(Icons.Link)
                                .setURL(Preview.page)
                        )
                ]
            });
        } catch (e) {
            return FriendlyInteractionError(interaction, `The website provided is not a valid url.\n\n${inlineCode(e)}`);
        }
    }
}
