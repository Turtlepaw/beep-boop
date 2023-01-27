import { ButtonInteraction } from "discord.js";
import { ServerConfiguration } from "../../commands/Guild/Server";
import Button from "../../lib/ButtonBuilder";
import { ButtonId } from "../../utils/config";
import { Permissions } from "../../configuration";
import { Logger } from "../../logger";

export default class ReturnButton extends Button {
    constructor() {
        super({
            CustomId: ButtonId.ReturnButton,
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        try {
            await ServerConfiguration(interaction);
        } catch (e) {
            Logger.error(`Couldn't return the config panel: ${e}`);
        }
    }
}