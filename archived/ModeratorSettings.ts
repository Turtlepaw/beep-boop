//@ts-nocheck
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, ComponentType } from "discord.js";
import { Embed, Emojis } from "../src/configuration";
import Button from "../src/lib/ButtonBuilder";
import { Filter } from "../src/utils/filter";

export interface ModeratorSettings {
    BlockInvites?: boolean;
}

export default class ModeratorGuildSettings extends Button {
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
        enum CustomId {
            ToggleInvites = "TOGGLE_INVITES"
        }
        function RefreshButtons() {
            const FreshSettings: ModeratorSettings = client.storage[SettingsKey];
            return new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(CustomId.ToggleInvites)
                        .setLabel("Invites")
                        .setStyle(
                            FreshSettings?.BlockInvites == null ? ButtonStyle.Danger :
                                FreshSettings?.BlockInvites ? ButtonStyle.Success : ButtonStyle.Danger
                        )
                )
        }

        function RefreshEmbed() {
            const FreshSettings: ModeratorSettings = client.storage[SettingsKey];
            return new Embed(interaction)
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

        const ButtonCollector = Message.createMessageComponentCollector({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter({
                member: interaction.member,
                customIds: CustomId
            })
        });

        ButtonCollector.on("collect", async (Button) => {
            if (Button.customId == CustomId.ToggleInvites) {
                client.storage[SettingsKey] = {
                    ...Settings,
                    BlockInvites: Settings?.BlockInvites == null ? true : !Settings?.BlockInvites
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