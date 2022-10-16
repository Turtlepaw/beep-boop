import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Interaction, ModalSubmitInteraction } from "discord.js";
import { Embed } from "../configuration";
import Event from "../lib/Event";

export default class AppealService extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, ModalInteraction: Interaction) {
        if (!ModalInteraction.isModalSubmit()) return;
        if (ModalInteraction.customId != "EVAL_MODAL") return;
        const Code = ModalInteraction.fields.getTextInputValue("code");
        const EvalResponse = eval(Code);
        await ModalInteraction.reply({
            ephemeral: true,
            content: "\📦 Evaluating code...",
            embeds: [
                new Embed()
                    .setDescription(`\`\`\`\n${EvalResponse}\`\`\``)
            ]
        })
    }
}