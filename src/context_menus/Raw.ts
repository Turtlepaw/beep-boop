import ContextMenu from "../lib/ContextMenuBuilder";
import { ApplicationCommandType, Client, MessageContextMenuCommandInteraction } from "discord.js";
import { Permissions } from "../configuration";
import { FriendlyInteractionError } from "../utils/error";
import { FindLegacyWebhook } from "../utils/Webhook";

export default class Migrate extends ContextMenu {
    constructor() {
        super({
            Name: "Migrate Message",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Type: ApplicationCommandType.Message,
            ClientPermissions: []
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        const webhook = await FindLegacyWebhook(interaction.targetId, interaction.channel.id, client);
        if (webhook == null) {
            FriendlyInteractionError(interaction, "Couldn't find webhook to sync with.")
            return;
        }

        await client.Storage.CustomWebhooks.Create({
            channelId: interaction.channel.id,
            url: webhook.url
        });

        await interaction.reply({
            ephemeral: true,
            content: "Custom message synced with database."
        })
    }
}