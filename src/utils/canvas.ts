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
    // Get the direct URL for Roboto TTF file from Google Fonts GitHub repo
    const url = "https://github.com/google/fonts/raw/master/apache/roboto/Roboto-Regular.ttf";
    // Download the file using axios and save it locally
    axios.get(url, { responseType: 'stream' })
        .then(response => {
            // Create a write stream for the TTF file
            const ttfFile = "Roboto-Regular.ttf";
            const writer = fs.createWriteStream(ttfFile);
            // Pipe the response data to the write stream
            response.data.pipe(writer);
            // Wait for the write stream to finish
            writer.on('finish', () => {
                // Register the font with a family name
                registerFont(ttfFile, { family: "Roboto" });
                // Create a canvas and get its context
                const canvas = createCanvas(500, 500);
                const ctx = canvas.getContext("2d");
                // Set the font for the context
                ctx.font = "16px 'Roboto'";
                // Draw some text on the canvas
                ctx.fillText("Hello world!", 100, 100);
            });
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}