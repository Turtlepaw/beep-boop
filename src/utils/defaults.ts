import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBooleanOption } from "discord.js";

export enum CommandOptionNames {
    Hidden = "hidden"
}

export const CommandOptions = {
    Hidden: (required?: boolean) => new SlashCommandBooleanOption()
        .setName(CommandOptionNames.Hidden)
        .setDescription("Make the command reply only visible to you.")
        .setRequired(required ?? false),
    GetHiden: (interaction: ChatInputCommandInteraction) => interaction.options.getBoolean(CommandOptionNames.Hidden)
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