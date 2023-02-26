import { ButtonInteraction, Client } from "discord.js";
import { Embed } from "../../configuration";
import Button from "../../lib/ButtonBuilder";

export default class SeeCommands extends Button {
    constructor() {
        super({
            CustomId: "SEE_COMMANDS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        interaction.reply({
            content: `Showing ${client.DetailedCommands.length} commands...`,
            embeds: [
                new Embed(interaction)
                    .addFields(
                        client.DetailedCommands.map(e => ({
                            name: `\`/${e.Name}\``,
                            value: `\`</${e.Name}:${e.Id}>\` = </${e.Name}:${e.Id}>`
                        }))
                    )
            ],
            ephemeral: true
        })
    }
}