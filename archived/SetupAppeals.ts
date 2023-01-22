import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Filter } from "../src/utils/filter";
import { SendAppealMessage } from "../src/utils/appeals";
import { Embed, Emojis } from "../src/configuration";
import Button from "../src/lib/ButtonBuilder";

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
        enum Id {
            Continue = "CONTINUE_OVERWRITE_SAVED_DATA",
            ChannelSelector = "SELECT_A_CHANNEL_APPEALS"
        }
        const CurrentSettings = client.storage[`${interaction.guild.id}_appeal_channel`];
        let Button: ButtonInteraction;
        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Continue")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(Id.Continue)
            )

        if (CurrentSettings != null) {
            const ActionMessage = await interaction.reply({
                content: "If you continue you'll overwrite your current settings, are you sure you want to continue?",
                components: [ActionButtons],
                fetchReply: true
            });

            Button = await ActionMessage.awaitMessageComponent({
                time: 0,
                filter: Filter({
                    member: interaction.member,
                    customIds: Id
                }),
                componentType: ComponentType.Button
            });
        }

        const Menu = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId(Id.ChannelSelector)
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
            filter: Filter({
                member: interaction.member,
                customIds: Id
            })
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