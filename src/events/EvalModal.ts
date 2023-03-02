/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, Events, ModalSubmitInteraction } from "discord.js";
import { ClientAdministrators, Embed, Icons } from "../configuration";
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
        const get = (val: string) => client.QuickStorage[val];
        const Code = interaction.fields.getTextInputValue("code");//`(async () => { ${interaction.fields.getTextInputValue("code")} })();`
        try {
            const EvalResponse = await eval(Code);
            await interaction.reply({
                ephemeral: true,
                content: `${Icons.Info} Evaluating code...`,
                embeds: [
                    await new Embed(interaction)
                        .setDescription(`\`\`\`\n${EvalResponse}\`\`\``)
                        .Resolve()
                ]
            });
        } catch (e) {
            await interaction.reply({
                ephemeral: true,
                content: `${Icons.Flag} Something went wrong evaluating that...`,
                embeds: [
                    await new Embed(interaction)
                        .setDescription(`\`\`\`\n${e}\`\`\``)
                        .Resolve()
                ]
            });
        }
    }
}
