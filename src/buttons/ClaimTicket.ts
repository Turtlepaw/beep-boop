import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import { Icons } from "../configuration";
import Button from "../lib/ButtonBuilder";

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
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Close")
                            .setStyle(ButtonStyle.Danger)
                            //.setEmoji("🔒")
                            .setCustomId("CLOSE_TICKET"),
                        new ButtonBuilder()
                            .setLabel("Claim")
                            .setStyle(ButtonStyle.Success)
                            //.setEmoji("🔍")
                            .setCustomId("CLAIM_TICKET")
                            .setDisabled(true)
                    )
            ],
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