import { ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import { ServerConfiguration } from "../commands/Server";
import Button from "../lib/ButtonBuilder";

export default class AddBirthday extends Button {
    constructor() {
        super({
            CustomId: "return",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await ServerConfiguration(interaction);
    }
}