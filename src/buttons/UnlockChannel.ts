import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Permissions, Unlock } from "../commands/Channel";
import { Embed, Icons } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class UnlockChannel extends Button {
    constructor() {
        super({
            CustomId: "UNLOCK_CHANNEL",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await Unlock(interaction.guild, interaction.channel as TextChannel);
        await interaction.reply({
            embeds: [
                new Embed()
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