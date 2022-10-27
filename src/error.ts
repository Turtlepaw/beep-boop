import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, ComponentType, Interaction, RequestManager } from "discord.js";
import { SupportServerInvite } from "./configuration";
import { generateId, generatePassword } from "./Id";

export async function SendError(interaction: Interaction, errorMessage: string) {
    if (interaction.isRepliable()) {
        const CustomId = {
            LearnMore: "REDIRECT_SUPPORT_SERVER",
            DeveloperOptions: "DEVELOPER_OPTIONS"
        }
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(CustomId.LearnMore)
                    .setLabel("Learn More")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel("Developer Options")
                    .setCustomId(CustomId.DeveloperOptions)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

        const Message = await interaction.reply({
            content: "Something didn't quite go right.",
            components: [Buttons],
            fetchReply: true
        });

        await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: (i) => i.customId == CustomId.DeveloperOptions,
            time: 0,
        }).then(async (ButtonInteraction) => {
            await ButtonInteraction.reply({
                content: `Here's what we know:\n\`\`\`${errorMessage}\`\`\``
            });
        }).catch(console.log);
    }
}