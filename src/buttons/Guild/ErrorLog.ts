import { ButtonInteraction, Client, EmbedBuilder } from "discord.js";
import { Embed, Emojis } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { FriendlyInteractionError } from "../../utils/error";
import { Pages } from "utilsfordiscordjs";

export interface ServerSettings {
    Levels?: boolean;
}

export default class ModeratorGuildSettings extends Button {
    constructor() {
        super({
            CustomId: "ERROR_LOG",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const { Errors } = client;
        const AllErrors = Errors.AllErrors(interaction.guild);

        if (AllErrors == null || AllErrors.length == 0) {
            await FriendlyInteractionError(interaction, "There's no error messages, yet...")
            return;
        }

        const PageEmbeds: EmbedBuilder[] = [];
        const BaseEmbed = new Embed(interaction)
            .setTitle(`${Emojis.Toolbox} Error Logs`);

        const Max = 5;
        let At = 0;
        let CurrentEmbed = new EmbedBuilder(BaseEmbed.data);
        let FieldsAdded = 0;
        for (const ErrorMessage of AllErrors) {
            if (At == Max) {
                At = 0;
                PageEmbeds.push(CurrentEmbed)
                CurrentEmbed = new EmbedBuilder(BaseEmbed.data);
                continue;
            }

            CurrentEmbed.addFields([{
                name: ErrorMessage.Summary,
                value: `This Effects: ${ErrorMessage.Effects}`
            }]);

            FieldsAdded++

            if (FieldsAdded == (AllErrors.length - 1)) {
                PageEmbeds.push(CurrentEmbed);
            }

            At++
        }

        new Pages()
            .setEmbeds(PageEmbeds)
            .send(interaction);
    }
}