import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function CreateLinkButton(Link: string, Label?: string) {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(Label || Link)
                .setURL(Link)
        )
}