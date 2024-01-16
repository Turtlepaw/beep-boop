import { FeedbackManager } from "@selects/LeaveFeedback";
import Button from "../../lib/ButtonBuilder";
import { ButtonInteraction, GuildMember } from "discord.js";

export default class TryFeedback extends Button {
    constructor() {
        super({
            CustomId: FeedbackManager.TryFeedback,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        const Feedback = new FeedbackManager(interaction.member as GuildMember);

        const Message = await Feedback.send(interaction);

        return interaction.client.QuickStorage[`f${Message.id}`] = interaction.guild.id;
    }
}