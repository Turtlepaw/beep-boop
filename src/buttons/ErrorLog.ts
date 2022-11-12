import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { Filter } from "../utils/filter";
import { FriendlyInteractionError } from "../utils/error";
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
        const BaseEmbed = new Embed()
            .setTitle(`${Emojis.Toolbox} Error Logs`);

        const Max = 5;
        let At = 0;
        let CurrentEmbed = new EmbedBuilder(BaseEmbed.data);
        for (const ErrorMessage of AllErrors) {
            if (At == Max) {
                PageEmbeds.push(CurrentEmbed)
                CurrentEmbed = new EmbedBuilder(BaseEmbed.data);
                continue;
            }

            CurrentEmbed.addFields([{
                name: ErrorMessage.Summary,
                value: `This Effects: ${ErrorMessage.Effects}`
            }]);

            if (AllErrors.length < Max && (At + 1) == AllErrors.length) {
                PageEmbeds.push(CurrentEmbed);
            }

            At++
        }

        new Pages()
            .setEmbeds(PageEmbeds)
            .send(interaction);
    }
}