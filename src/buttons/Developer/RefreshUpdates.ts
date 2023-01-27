import { ButtonInteraction, Client, NewsChannel as GuildNewsChannel, WebhookType } from "discord.js";
import { ClientAdministrators, Dot, Icons, News } from "../../configuration";
import Button from "../../lib/ButtonBuilder";

export interface ModeratorSettings {
    BlockInvites?: boolean;
}

export default class ModeratorGuildSettings extends Button {
    constructor() {
        super({
            CustomId: "REFRESH_UPDATE_CHANNELS",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await interaction.deferReply({ ephemeral: true });
        if (!ClientAdministrators.includes(interaction.user.id)) return;
        const guilds = await interaction.client.guilds.fetch();
        let Added = 0;
        let CouldNotAdd = 0;
        let AlreadySubscribed = 0;
        for (const guild of guilds.values()) {
            try {
                const Guild = await guild.fetch();
                //const Channels = await Guild.channels.fetch();
                const UpdatesGuild = await client.guilds.fetch(News.Guild);
                const UpdatesChannel = await UpdatesGuild.channels.fetch(News.Channel) as GuildNewsChannel;
                const PublicUpdatesChannel = Guild.publicUpdatesChannel;
                if (PublicUpdatesChannel == null) continue;
                const Webhooks = await PublicUpdatesChannel.fetchWebhooks();
                if (
                    Webhooks.filter(e => e.type == WebhookType.ChannelFollower && e.sourceChannel.id == News.Channel).size != 0
                ) {
                    AlreadySubscribed++
                    continue;
                }

                await UpdatesChannel.addFollower(PublicUpdatesChannel);
                Added++
            } catch (e) {
                CouldNotAdd++
            }
        }

        await interaction.editReply({
            content: `${Icons.Sync} Subscribed servers to community update channel.\n\n${Dot.Default} Subscribed ${Added} servers\n${Dot.Default} ${AlreadySubscribed} are already subscribed\n${Dot.Default} Could not add ${CouldNotAdd} servers`
        })
    }
}