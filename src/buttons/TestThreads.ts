import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, InteractionResponse, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../lib/ButtonBuilder";

export default class TestThreads extends Button {
    constructor() {
        super({
            CustomId: "test_threads",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Channel = interaction.channel;
        if (Channel.isThread() || Channel.isVoiceBased()) {
            await interaction.reply({
                ephemeral: true,
                content: "Cannot create thread on this type of channel."
            });
            return;
        }
        const Message = await interaction.channel.send({
            content: "🧵 Click below to access the thread."
        });

        const Thread = await Channel.threads.create({
            startMessage: Message.id,
            name: "🧵 Thread"
        });

        interaction.reply({
            content: `Thread Created`,
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel("Open Thread")
                            .setURL(Thread.url)
                    )
            ],
            ephemeral: true
        })
    }
}