//@ts-nocheck
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, ComponentType } from "discord.js";
import { Embed, Emojis } from "../src/configuration";
import Button from "../src/lib/ButtonBuilder";
import { Filter } from "../src/utils/filter";

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
            return new Embed(interaction)
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
            filter: Filter({
                member: interaction.member,
                customIds: CustomId
            })
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