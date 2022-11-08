import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendAppealMessage } from "../appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";

export interface ModeratorSettings {
    BlockInvites?: boolean;
}

export default class TestAppeals extends Button {
    constructor() {
        super({
            CustomId: "MODERATOR_SETTINGS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const SettingsKey = `${interaction.guild.id}_mod_settings`;
        const Settings: ModeratorSettings = client.storage[SettingsKey];
        const Ids = {
            ToggleInvites: "TOGGLE_INVITES"
        }
        function RefreshButtons() {
            const FreshSettings: ModeratorSettings = client.storage[SettingsKey];
            return new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(Ids.ToggleInvites)
                        .setLabel("Invites")
                        .setStyle(
                            FreshSettings?.BlockInvites == null ? ButtonStyle.Danger :
                                FreshSettings?.BlockInvites ? ButtonStyle.Success : ButtonStyle.Danger
                        )
                )
        }

        function RefreshEmbed() {
            const FreshSettings: ModeratorSettings = client.storage[SettingsKey];
            return new Embed()
                .setTitle("Moderator Settings")
                .addFields([{
                    name: `${Emojis.Link} Invites`,
                    value: FreshSettings?.BlockInvites ? QuickMessages.Enabled : QuickMessages.Disabled
                }])
        }

        const QuickMessages = {
            Enabled: `${Emojis.Enabled} Enabled`,
            Disabled: `${Emojis.Disabled} Disabled`
        }

        const Message = await interaction.reply({
            embeds: [
                RefreshEmbed()
            ],
            components: [
                RefreshButtons()
            ],
            fetchReply: true
        });

        const ButtonInteraction = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button,
            filter: i => i.user.id == interaction.user.id
        });

        if (ButtonInteraction.customId == Ids.ToggleInvites) {
            client.storage[SettingsKey] = {
                ...Settings,
                BlockInvites: Settings?.BlockInvites == null ? true : !Settings?.BlockInvites
            };

            await ButtonInteraction.update({
                components: [
                    RefreshButtons()
                ],
                embeds: [
                    RefreshEmbed()
                ]
            });
        }
    }
}