import { Client, WebhookClient } from "discord.js";

export async function FindWebhook(MessageId: string, ChannelId: string, client: Client) {
    const Webhooks = client.Storage.GetArray<string>(`custom_webhooks_${ChannelId}`);

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