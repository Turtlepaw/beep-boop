import { ButtonInteraction, ChannelType, Client, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from "discord.js";
import Button from "../lib/ButtonBuilder";

export default class AddBirthday extends Button {
    constructor() {
        super({
            CustomId: "ADD_AS_BIRTHDAY",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const event = await interaction.guild.scheduledEvents.create({
            entityType: GuildScheduledEventEntityType.External,
            name: "🎉 Server Birthday",
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            scheduledStartTime: interaction.guild.createdTimestamp + 31556952000,
            entityMetadata: {
                location: "In this server"
            },
            scheduledEndTime: (interaction.guild.createdTimestamp + 31556952000) + 86400000
        });

        const invite = await event.createInviteURL({
            temporary: false,
            maxAge: 0,
            maxUses: 0,
            //@ts-expect-error
            channel: interaction.guild.rulesChannel || interaction.guild.channels.cache.filter(e => e.type = ChannelType.GuildText).first()
        });

        interaction.reply({
            content: `Successfully created the event: ${invite}`,
            ephemeral: true
        })
    }
}