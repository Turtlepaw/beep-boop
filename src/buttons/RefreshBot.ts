import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, NewsChannel as GuildNewsChannel, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import { ClientAdministators, Embed, Emojis, guildId, NewsChannel } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { Filter } from "../utils/filter";

export interface ModeratorSettings {
    BlockInvites?: boolean;
}

export default class ModeratorGuildSettings extends Button {
    constructor() {
        super({
            CustomId: "REFRESH_BOT",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        if (!ClientAdministators.includes(interaction.user.id)) return;
        await interaction.reply({
            content: "☁️ Restarting the bot, this might take a few minutes...",
            ephemeral: true
        });
        process.exit();
    }
}