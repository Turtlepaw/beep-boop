import { ActionRowBuilder, ButtonInteraction, ChannelType, Client, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, SelectMenuBuilder, SelectMenuOptionBuilder } from "discord.js";
import Button from "../lib/ButtonBuilder";

export const DiscordEvents = [
    "ChannelCreate",
    "ChannelDelete",
    "GuildBanAdd",
    "GuildBanRemove",
    "GuildCreate",
    "GuildDelete",
    "GuildMemberAdd",
    "GuildMemberAvailable",
    "GuildMemberRemove",
    "GuildRoleCreate",
    "GuildRoleDelete",
    "GuildRoleUpdate",
    "GuildScheduledEventCreate",
    "GuildScheduledEventDelete",
    "GuildScheduledEventUpdate",
    "GuildScheduledEventUserAdd",
    "GuildScheduledEventUserRemove",
    "GuildStickerCreate",
    "GuildUpdate"
]

export default class AddBirthday extends Button {
    constructor() {
        super({
            CustomId: "EMIT_EVENT",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Components = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .addOptions(
                        DiscordEvents.map(e =>
                            new SelectMenuOptionBuilder()
                                .setEmoji("📦")
                                .setLabel(e)
                                .setValue(e)
                        )
                    )
                    .setCustomId("EVENT_LIST")
                    .setPlaceholder("Select an event to emit")
            );

        await interaction.reply({
            content: `**⚠️ BEEP! This could cuase unexpected side effects or consequences, use at your own risk.**\nWhat event do you want to emit.`,
            components: [Components],
            ephemeral: true
        });
    }
}