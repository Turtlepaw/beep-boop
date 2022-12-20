import { ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import { ServerConfiguration } from "../commands/Server";
import Button from "../lib/ButtonBuilder";
import { ButtonId } from "../utils/config";
import { Permissions } from "../configuration";

export default class ReturnButton extends Button {
    constructor() {
        super({
            CustomId: ButtonId.ReturnButton,
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await ServerConfiguration(interaction);
    }
}