import { ButtonInteraction, Client } from "discord.js";
import { ClientAdministrators, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { Components } from "../../utils/defaults";

export interface ModeratorSettings {
    BlockInvites?: boolean;
}

export default class ModeratorGuildSettings extends Button {
    constructor() {
        super({
            CustomId: "REFRESH_BOT",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        if (!ClientAdministrators.includes(interaction.user.id)) return;
        const Message = await interaction.reply({
            components: [Components.ConfirmButton({ invertStyles: true })],
            content: `${Icons.Refresh} Are you sure you want to **restart the entire bot?**`,
            ephemeral: true,
            fetchReply: true
        });

        const ButtonReply = await Message.awaitMessageComponent({
            time: 0
        });

        await ButtonReply.update({
            content: `${Icons.Refresh} Destroying the bot and exiting process, this might take a few minutes...`
        });

        client.destroy();
        process.exit();
    }
}