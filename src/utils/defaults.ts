import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBooleanOption } from "discord.js";

export const CommandOptions = {
    Hidden: (required?: boolean) => new SlashCommandBooleanOption()
        .setName("hidden")
        .setDescription("Make the command reply only visible to you.")
        .setRequired(required ?? false)
};

export const Components = {
    ConfirmButton: (options: { cancelText?: string, confirmText?: string, invertStyles?: boolean }) => new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel(options?.confirmText ?? "Confirm Action")
                .setStyle(options?.invertStyles ? ButtonStyle.Danger : ButtonStyle.Success),
            new ButtonBuilder()
                .setLabel(options?.cancelText ?? "Cancel Action")
                .setStyle(options?.invertStyles ? ButtonStyle.Success : ButtonStyle.Danger)
        )
};