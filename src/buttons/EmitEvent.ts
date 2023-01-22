import { ButtonInteraction } from "discord.js";
import Button from "../lib/ButtonBuilder";
import { StringSelectBuilder, StringSelector } from "../utils/components";

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

export default class EmitEvent extends Button {
    constructor() {
        super({
            CustomId: "EMIT_EVENT",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        const Selector = new StringSelector()
            .AddOptions(
                ...DiscordEvents.map(e =>
                    new StringSelectBuilder()
                        .setEmoji({
                            name: "📦"
                        })
                        .setLabel(e)
                        .setValue(e)
                )
            )
            .SetCustomId("EVENT_LIST")
            .Placeholder("Select an event to emit")

        await interaction.reply({
            content: `**⚠️ BEEP! This could cuase unexpected side effects or consequences, use at your own risk.**\nWhat event do you want to emit.`,
            components: Selector.toComponents(),
            ephemeral: true
        });
    }
}