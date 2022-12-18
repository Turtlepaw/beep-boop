import { ButtonBuilder, ButtonStyle } from "discord.js";
import { Icons } from "../configuration";

export enum ButtonId {
    ReturnButton = "RETURN"
}
export const BackComponent = new ButtonBuilder()
    .setLabel("Back")
    .setCustomId(ButtonId.ReturnButton)
    .setStyle(ButtonStyle.Danger)

export function ButtonBoolean(bool: boolean) {
    return bool == true ? ButtonStyle.Success : ButtonStyle.Danger;
}

export function TextBoolean(bool: boolean, text: string) {
    return `${bool == true ? Icons.Enabled : Icons.Disabled} ${text}`
}