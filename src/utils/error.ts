import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, ComponentType, Guild, Interaction, RequestManager } from "discord.js";
import { Emojis, SupportServerInvite } from "../configuration";
import { generateId, generatePassword } from "./Id";

export interface ErrorMessage {
    GuildId: string;
    Summary: string;
    Effects: string;
}

export interface ErrorStorage {
    [key: string]: ErrorMessage[];
}

export class ErrorManager {
    AddError(Summary: string, Effects: string, Guild: Guild) {
        const Key = this.GenerateKey(Guild.id);
        const Items = Guild.client.storage[Key];

        Guild.client.storage[Key] = [{
            GuildId: Guild.id,
            Summary,
            Effects
        },
        ...(Items == null ? [] : Items)
        ];
    }

    AllErrors(Guild: Guild): ErrorMessage[] {
        const Key = this.GenerateKey(Guild.id);
        return Guild.client.storage[Key];
    }

    private GenerateKey(Id: string) {
        return `${Id}_errors`
    }
}

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
                    .setDisabled(false)
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
                content: `Here's what we know:\n\n\`\`\`${errorMessage}\`\`\``
            });
        }).catch(console.log);
    }
}

export async function FriendlyInteractionError(interaction: Interaction, errorMessage: string) {
    if (interaction.isRepliable()) {
        await interaction.reply({
            content: `${Emojis.Error} ` + errorMessage,
            ephemeral: true
        });
    }
}