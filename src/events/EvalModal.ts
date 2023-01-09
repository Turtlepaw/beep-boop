import { NewsChannel as GuildNewsChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Interaction, ModalSubmitInteraction } from "discord.js";
import { ClientAdministrators, Embed, guildId } from "../configuration";
import Event from "../lib/Event";

export default class EvalModal extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, interaction: ModalSubmitInteraction) {
        //await interaction.deferReply();
        if (!interaction.isModalSubmit()) return;
        if (!ClientAdministrators.includes(interaction.user.id)) return;
        if (interaction.customId != "EVAL_MODAL") return;
        const Code = interaction.fields.getTextInputValue("code");
        try {
            const EvalResponse = await eval(Code);
            await interaction.reply({
                ephemeral: true,
                content: "\📦 Evaluating code...",
                embeds: [
                    new Embed(interaction.guild)
                        .setDescription(`\`\`\`\n${EvalResponse}\`\`\``)
                ]
            });
        } catch (e) {
            await interaction.reply({
                ephemeral: true,
                content: "\📦 Something didn't go right...",
                embeds: [
                    new Embed(interaction.guild)
                        .setDescription(`\`\`\`\n${e}\`\`\``)
                ]
            });
        }
    }
}