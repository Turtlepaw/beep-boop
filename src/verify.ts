import { ColorResolvable } from "discord.js";

function isHexColor(str: string): str is `#${string}` {
    return str.startsWith("#");
}

function String(str: string): str is string {
    if (str == '') return false;
    return typeof str == 'string';
}

function InviteLink(str: string) {
    //check invite...

}

export const Verifiers = {
    isHexColor,
    String
}