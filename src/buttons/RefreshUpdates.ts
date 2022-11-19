import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, NewsChannel as GuildNewsChannel, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle, WebhookType } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import { ClientAdministators, Embed, Emojis, guildId, NewsChannel } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { Filter } from "../utils/filter";

export interface ModeratorSettings {
    BlockInvites?: boolean;
}

export default class ModeratorGuildSettings extends Button {
    constructor() {
        super({
            CustomId: "REFRESH_UPDATE_CHANNELS",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await interaction.deferReply({ ephemeral: true });
        if (!ClientAdministators.includes(interaction.user.id)) return;
        const guilds = await interaction.client.guilds.fetch();
        let Added = 0;
        let AlreadySubscribed = 0;
        for (const guild of guilds.values()) {
            const Guild = await guild.fetch();
            console.log(Guild.name)
            const Channels = await Guild.channels.fetch();
            const UpdatesGuild = await client.guilds.fetch(guildId);
            const UpdatesChannel = await UpdatesGuild.channels.fetch(NewsChannel) as GuildNewsChannel;
            const PublicUpdatesChannel = Guild.publicUpdatesChannel;
            if (PublicUpdatesChannel == null) continue;
            const Webhooks = await PublicUpdatesChannel.fetchWebhooks();
            if (
                Webhooks.filter(e => e.type == WebhookType.ChannelFollower && e.sourceChannel.id == NewsChannel).size != 0
            ) {
                AlreadySubscribed++
                continue;
            }

            await UpdatesChannel.addFollower(PublicUpdatesChannel);
            Added++
        }

        await interaction.editReply({
            content: `☁️ Subscribed to all community update channels.\n\n- Subscribed ${Added}\n- ${AlreadySubscribed} are already subscribed`
        })
    }
}