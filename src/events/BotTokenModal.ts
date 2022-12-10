import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildMember, Interaction, ModalSubmitInteraction } from "discord.js";
import { Filter } from "../utils/filter";
import { Embed } from "../configuration";
import Event from "../lib/Event";
import { CustomBrandingModal } from "../buttons/ActivateBranding";
import { StartCustomBot } from "../utils/customBot";

export default class AppealModal extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, ModalInteraction: Interaction) {
        if (!ModalInteraction.isModalSubmit()) return;
        if (ModalInteraction.customId != CustomBrandingModal) return;
        const Fields = {
            BotToken: ModalInteraction.fields.getTextInputValue("TOKEN")
        }

        await ModalInteraction.reply({
            fetchReply: true,
            content: "Logging your bot in...",
            ephemeral: true
        });

        StartCustomBot(Fields.BotToken);

        await ModalInteraction.editReply({
            content: "🎉 Your bot's now online, you should see a message arrive in a channel that it can speak in."
        });

        await client.Storage.CustomBots.Create({
            Token: Fields.BotToken
        });
    }
}