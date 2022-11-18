import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { Filter } from "../utils/filter";

export interface ServerSettings {
    Levels?: boolean;
    WelcomeDelete?: boolean;
}

export default class ModeratorGuildSettings extends Button {
    constructor() {
        super({
            CustomId: "SERVER_SETTINGS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const SettingsKey = `${interaction.guild.id}_server_settings`;
        const Settings: ServerSettings = client.storage[SettingsKey];
        enum CustomId {
            ToggleLevels = "TOGGLE_LEVELS",
            ToggleAutoDelete = "TOGGLE_AUTO_DELETE"
        }
        function RefreshButtons() {
            const FreshSettings: ServerSettings = client.storage[SettingsKey];
            return new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(CustomId.ToggleLevels)
                        .setLabel("Levels")
                        .setStyle(
                            FreshSettings?.Levels == null ? ButtonStyle.Danger :
                                FreshSettings?.Levels ? ButtonStyle.Success : ButtonStyle.Danger
                        ),
                    new ButtonBuilder()
                        .setCustomId(CustomId.ToggleAutoDelete)
                        .setLabel("Auto Delete")
                        .setStyle(
                            FreshSettings?.WelcomeDelete == null ? ButtonStyle.Danger :
                                FreshSettings?.WelcomeDelete ? ButtonStyle.Success : ButtonStyle.Danger
                        )
                )
        }

        function RefreshEmbed() {
            const FreshSettings: ServerSettings = client.storage[SettingsKey];
            return new Embed()
                .setTitle("Moderator Settings")
                .addFields([{
                    name: `${Emojis.Up} Levels`,
                    value: FreshSettings?.Levels ? QuickMessages.Enabled : QuickMessages.Disabled
                }, {
                    name: `${Emojis.Trash} Welcome Message Auto Delete`,
                    value: FreshSettings?.WelcomeDelete ? QuickMessages.Enabled : QuickMessages.Disabled
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

        const ButtonCollector = Message.createMessageComponentCollector({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter(interaction.member, CustomId.ToggleLevels, CustomId.ToggleAutoDelete)
        });

        ButtonCollector.on("collect", async (Button) => {
            if (Button.customId == CustomId.ToggleLevels) {
                client.storage[SettingsKey] = {
                    ...Settings,
                    WelcomeDelete: Settings?.WelcomeDelete == null ? true : !Settings?.WelcomeDelete
                };

                await Button.update({
                    components: [
                        RefreshButtons()
                    ],
                    embeds: [
                        RefreshEmbed()
                    ]
                });
            } else if (Button.customId == CustomId.ToggleAutoDelete) {
                client.storage[SettingsKey] = {
                    ...Settings,
                    WelcomeDelete: Settings?.WelcomeDelete == null ? true : !Settings?.WelcomeDelete
                };

                await Button.update({
                    components: [
                        RefreshButtons()
                    ],
                    embeds: [
                        RefreshEmbed()
                    ]
                });
            }
        })
    }
}