import { ButtonBuilder, ButtonStyle } from "discord.js";
import { Icons } from "../configuration";

export const BackComponent = new ButtonBuilder()
    .setLabel("Back")
    .setCustomId("return")
    .setStyle(ButtonStyle.Danger)

export function ButtonBoolean(bool: boolean) {
    return bool == true ? ButtonStyle.Success : ButtonStyle.Danger;
}

export function TextBoolean(bool: boolean, text: string) {
    return `${bool == true ? Icons.Enabled : Icons.Disabled} ${text}`
}