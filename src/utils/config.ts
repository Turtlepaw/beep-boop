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

export function StatusBoolean(bool: boolean, text?: string) {
    return `${bool == true ? "Enabled" : "Disabled"}${text != null ? ` ${text}` : ""}`
}

export function StringBoolean(bool: boolean, relative: boolean = true, text?: string) {
    const Ending = relative ? "d" : "";
    const Words = {
        Enable: `Enable${Ending}`,
        Disable: `Disable${Ending}`
    }
    return `${bool == true ? Words.Enable : Words.Disable}${text != null ? ` ${text}` : ""}`
}

export function TextBoolean(bool: boolean, text?: string) {
    return `${bool == true ? Icons.Enabled : Icons.Disabled} ${text}`
}