import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { TicketButtons } from "../../utils/Tickets";

export default class ClaimTicket extends Button {
    constructor() {
        super({
            CustomId: "CLAIM_TICKET",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["ManageChannels", "KickMembers", "ManageMessages", "BanMembers"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        await interaction.update({
            components: TicketButtons(interaction.channel, true),
            embeds: [
                new EmbedBuilder(interaction.message.embeds[0].data)
                    .setFields([
                        ...interaction.message.embeds[0].data.fields.filter(e => e.name != "Claimed By"), {
                            name: "Claimed By",
                            value: interaction.user.toString(),
                            inline: true
                        }
                    ])
            ]
        });

        await interaction.followUp({
            content: `${Icons.Flag} ${interaction.user} has claimed the ticket.`
        })
    }
}