import { inlineCode, AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandStringOption } from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { FriendlyInteractionError } from "../../utils/error";
import { getScreenshot, ResolveURL } from "../../utils/Web";

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
                    .setDescription("Make the reply visible only to you and hidden to everyone else.")
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        const Link = interaction.options.getString("website")
        const ephemeral = interaction.options.getBoolean("hidden") ?? true;

        await interaction.deferReply({ ephemeral })
        try {
            const Preview = await getScreenshot(null, ResolveURL(Link));
            const Attachment = new AttachmentBuilder(Preview);

            await interaction.editReply({
                files: [Attachment]
            });
        } catch (e) {
            return FriendlyInteractionError(interaction, `The website provided is not a valid url.\n\n${inlineCode(e)}`);
        }
    }
}
