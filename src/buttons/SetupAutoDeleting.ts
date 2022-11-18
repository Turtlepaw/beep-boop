import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Filter } from "../utils/filter";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

export default class SetupAppeals extends Button {
    constructor() {
        super({
            CustomId: "AUTO_DELETE_SETTINGS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const CurrentSettings = client.Storage.Get(`${interaction.guild.id}_auto_deleting`);
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
                    .setMaxValues(10)
                    .setMinValues(1)
                    .addOptions(
                        interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText).map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.TextChannel)
                        )
                    )
            )

        await (interaction.replied ? Button : interaction).reply({
            content: "Let's start with the auto deleting channels.",
            components: [Menu]
        });

        const Message = await interaction.fetchReply();

        const SelectMenuInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.SelectMenu,
            time: 0,
            filter: Filter(interaction.member, "CHANNEL_SELECT")
        });

        client.Storage.Create(`${interaction.guild.id}_auto_deleting`, SelectMenuInteraction.values);
        await SelectMenuInteraction.reply({
            embeds: [
                new Embed()
                    .setTitle(`${Emojis.Tada} You're all set!`)
                    .setDescription("Auto deleting has been set up! When members leave and they've sent a message in one or more of those channels, it will be deleted.")
            ]
        })
    }
}