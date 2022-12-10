import { Client, WebhookClient } from "discord.js";

export async function FindWebhook(MessageId: string, ChannelId: string, client: Client) {
    const Webhooks = await client.Storage.CustomWebhooks.FindBy({
        channelId: ChannelId
    });

    if (Webhooks == null || Webhooks.length == 0) return;

    for (const WebhookURL of Webhooks) {
        try {
            const Webhook = new WebhookClient({ url: WebhookURL.url });
            const Message = await Webhook.fetchMessage(MessageId);
            if (Message != null) {
                return Webhook
            }
        } catch (error) {
            console.log(`Possible Error:`.gray, `${error}`.gray)
        }
    }
}

export async function FindLegacyWebhook(MessageId: string, ChannelId: string, client: Client) {
    const Webhooks = await client.LegacyStorage[`custom_webhooks_${ChannelId}`]

    if (Webhooks == null || Webhooks.length == 0) return;

    for (const WebhookURL of Webhooks) {
        try {
            const Webhook = new WebhookClient({ url: WebhookURL });
            const Message = await Webhook.fetchMessage(MessageId);
            if (Message != null) {
                return Webhook
            }
        } catch (error) {
            console.log(`Possible Error:`.gray, `${error}`.gray)
        }
    }
}