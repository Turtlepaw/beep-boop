import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendAppealMessage } from "../appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class TestAppeals extends Button {
    constructor() {
        super({
            CustomId: "SETUP_APPEALS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Menu = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("CHANNEL_SELECT")
                    .addOptions(
                        interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText).map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.TextChannel)
                        )
                    )
            )

        await interaction.reply({
            content: "Let's start with where you want to have the appeals go",
            components: [Menu]
        });

        const Message = await interaction.fetchReply();

        const SelectMenuInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.SelectMenu,
            time: 0
        });

        client.storage[`${interaction.guild.id}_appeal_channel`] = SelectMenuInteraction.values[0];
        await SelectMenuInteraction.reply({
            embeds: [
                new Embed()
                    .setTitle(`${Emojis.Tada} You're all set!`)
                    .setDescription("Appeals have been successfully set up in your server! Members that get banned will now get a DM with the appeal form. If you'd like to test this out you can use the </developer:1030997072175968326> command.")
            ]
        })
    }
}