import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction, TextChannel } from "discord.js";
import { Unlock } from "../../commands/Channel";
import { Embed, Icons, Permissions } from "../../configuration";
import Button from "../../lib/ButtonBuilder";

export default class UnlockChannel extends Button {
    constructor() {
        super({
            CustomId: "UNLOCK_CHANNEL",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Moderator
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        await Unlock(interaction.guild, interaction.channel as TextChannel);
        await interaction.update({
            embeds: [
                new Embed(interaction.guild)
                    .setTitle(`${Icons.Unlock} This channel has been unlocked.`)
                    .setAuthor({
                        name: `Unlocked by ${interaction.user.username}`,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription("This channel has been unlocked by moderators.")
            ]
        });

        await interaction.message.edit({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        (interaction.message.components[0].components as ButtonComponent[]).map(e =>
                            ButtonBuilder.from(e).setDisabled(true)
                        )
                    )
            ]
        })
    }
}