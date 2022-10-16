import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendAppealMessage } from "../appeals";
import { Embed } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class TestAppeals extends Button {
    constructor() {
        super({
            CustomId: "TEST_APPEALS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        //@ts-expect-error
        await SendAppealMessage(interaction.member);
    }
}