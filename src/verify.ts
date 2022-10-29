import { ColorResolvable } from "discord.js";

function isHexColor(str: string): str is `#${string}` {
    return str.startsWith("#");
}

export const Verifiers = {
    isHexColor
}