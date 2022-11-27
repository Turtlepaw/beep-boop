import { Base64String, Message as GuildMessage, Webhook, WebhookClient } from "discord.js"
import fetch from "node-fetch";

export type ShortenResponse = {
    id: string
    url: string
    expires: Date
}

export async function ShortenURL(Message: GuildMessage, Webhook: Webhook | WebhookClient) {
    const json = {
        "messages": [{
            "data": {
                "content": Message.content,
                "embeds": Message.embeds.map(e => e.toJSON()),
                "attachments": Message.attachments.size >= 1 ? Message.attachments.map(e => e.toJSON) : []
            }
        }],
        "targets": [{
            "url": Webhook.url.replace("api", "api/v10")
        }]
    };

    const url = GenerateURL({ Object: json });

    const response = await fetch("https://share.discohook.app/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    })

    if (!response.ok) throw new Error("Could not get short URL.")

    const data = await response.json()

    return {
        ...data,
        expires: new Date(data.expires),
    } as ShortenResponse
}

export function GenerateURL({ Webhook, Object }: { Webhook?: WebhookClient | Webhook, Object?: object }): `https://discohook.app/?data=${Base64String}` {
    const json = Object || {
        "messages":
            [{
                "data": {
                    "content": null,
                    "embeds": null
                }
            }],
        "targets": [{
            "url": Webhook.url.replace("api", "api/v10")
        }]
    }

    const JSONString = JSON.stringify(json);
    const Base64 = btoa(JSONString);
    return `https://discohook.app/?data=${Base64}`;
}