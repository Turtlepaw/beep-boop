import { ButtonBuilder } from "discord.js";

export class DiscordButtonBuilder extends ButtonBuilder {
    safelySetEmoji(emoji?: string) {
        if (emoji == null || emoji == "") return this;
        this.setEmoji(emoji)
        return this;
    }
}