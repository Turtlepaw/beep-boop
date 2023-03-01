import { FeedbackManager } from "@selects/LeaveFeedback";
import Button from "../../lib/ButtonBuilder";
import { ButtonInteraction } from "discord.js";

export default class CollectFeedback extends Button {
    constructor() {
        super({
            CustomId: FeedbackManager.CollectButton,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        const GuildId = interaction.client.QuickStorage[`f${interaction.message.id}`];
        const member = await (await interaction.client.guilds.fetch(GuildId)).members.fetch(interaction.user.id);
        const Feedback = new FeedbackManager(member);
        const config = await interaction.client.Storage.Configuration.forGuild({
            id: GuildId,
            name: "unknown"
        });

        return Feedback.collect(config.LeaveFeedback?.Channel, interaction);
    }
}