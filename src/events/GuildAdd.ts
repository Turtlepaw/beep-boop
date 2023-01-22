import { Colors as DiscordColors, Client, Events, Guild, NewsChannel as GuildNewsChannel } from "discord.js";
import { Colors, News } from "../configuration";
import Event from "../lib/Event";
import { Logger } from "../logger";

export default class DMService extends Event {
    constructor() {
        super({
            EventName: Events.GuildCreate
        });
    }

    async ExecuteEvent(client: Client, Guild: Guild) {
        try {
            //const Channels = await Guild.channels.fetch();
            const UpdatesGuild = await client.guilds.fetch(News.Guild);
            const UpdatesChannel = await UpdatesGuild.channels.fetch(News.Channel) as GuildNewsChannel;
            const PublicUpdatesChannel = Guild.publicUpdatesChannel;
            if (PublicUpdatesChannel == null) return;
            await UpdatesChannel.addFollower(PublicUpdatesChannel);
        } catch (e) {
            Logger.error(`Failed subscribing to update channel: ${e}`);
        }

        try {
            const Roles = await Guild.roles.fetch();
            const MyRole = Roles.find(e => e.name == client.application.name && e.managed);
            MyRole.edit({
                color: client.user.username.includes("Canary") ? DiscordColors.Blurple : Colors.BrandColor
            });
        } catch (e) {
            Logger.error(`Failed chaning my role: ${e}`);
        }
    }
}