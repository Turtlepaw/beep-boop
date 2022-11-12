import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { Filter } from "../utils/filter";

export interface ServerSettings {
    Levels?: boolean;
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
            ToggleLevels = "TOGGLE_LEVELS"
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
                        )
                )
        }

        function RefreshEmbed() {
            const FreshSettings: ServerSettings = client.storage[SettingsKey];
            console.log(FreshSettings, SettingsKey)
            return new Embed()
                .setTitle("Moderator Settings")
                .addFields([{
                    name: `${Emojis.Up} Levels`,
                    value: FreshSettings?.Levels ? QuickMessages.Enabled : QuickMessages.Disabled
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
            filter: Filter(interaction.member, CustomId.ToggleLevels)
        });

        ButtonCollector.on("collect", async (Button) => {
            if (Button.customId == CustomId.ToggleLevels) {
                client.storage[SettingsKey] = {
                    ...Settings,
                    Levels: Settings?.Levels == null ? true : !Settings?.Levels
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