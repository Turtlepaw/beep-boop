import { Canvas, createCanvas, registerFont } from "canvas";
import axios from "axios";
import fs from "fs";

export function applyText(canvas: Canvas, text: string, font = "sans-serif", fontSize = 70) {
    const context = canvas.getContext('2d');

    do {
        context.font = `${fontSize -= 10}px ${font}`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
}

export function useUsername(username: string, nickname: string | null | undefined) {
    return username == null ? "Unknown User" : (nickname != null ? nickname : username);
}

// Define a function that takes a Google font name as input
export async function loadGoogleFont(fontName: string) {
    const fontUrl = `https://github.com/google/fonts/raw/main/ofl/${fontName.toLowerCase()}/${fontName}-Regular.ttf`;
    const fontBuffer = await axios.get(fontUrl, { responseType: 'arraybuffer' }).then(res => res.data);
    const font = new FontFace(fontName, fontBuffer);
    await font.load();
    return font;
}