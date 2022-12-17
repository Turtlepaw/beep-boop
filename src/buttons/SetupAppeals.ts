import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Filter } from "../utils/filter";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class SetupAppeals extends Button {
    constructor() {
        super({
            CustomId: "SETUP_APPEALS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const CurrentSettings = client.storage[`${interaction.guild.id}_appeal_channel`];
        let Button: ButtonInteraction;
        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Continue")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("CONTINUE")
            )

        if (CurrentSettings != null) {
            const ActionMessage = await interaction.reply({
                content: "If you continue you'll overwrite your current settings, are you sure you want to continue?",
                components: [ActionButtons],
                fetchReply: true
            });

            Button = await ActionMessage.awaitMessageComponent({
                time: 0,
                filter: Filter(interaction.member, "CONTINUE"),
                componentType: ComponentType.Button
            });
        };

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

        const Message = await (interaction.replied ? Button : interaction).reply({
            content: "Let's start with where you want to have the appeals go",
            components: [Menu],
            fetchReply: true
        });

        //const Message = await interaction.fetchReply();

        const SelectMenuInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.SelectMenu,
            time: 0,
            filter: Filter(interaction.member, "CHANNEL_SELECT")
        });

        client.storage[`${interaction.guild.id}_appeal_channel`] = SelectMenuInteraction.values[0];
        await SelectMenuInteraction.reply({
            embeds: [
                new Embed(interaction.guild)
                    .setTitle(`${Emojis.Tada} You're all set!`)
                    .setDescription("Appeals have been successfully set up in your server! Members that get banned will now get a DM with the appeal form. If you'd like to test this out you can use the </developer:1030997072175968326> command.")
            ]
        })
    }
}