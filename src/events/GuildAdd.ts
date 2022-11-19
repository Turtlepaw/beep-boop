import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelFlagsBitField, ChannelType, Client, Events, Guild, GuildMember, Message as GuildMessage, NewsChannel as GuildNewsChannel } from "discord.js";
import { Embed, Emojis, guildId, Logs, NewsChannel } from "../configuration";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { Verifiers } from "../utils/verify";

export default class DMService extends Event {
    constructor() {
        super({
            EventName: Events.GuildCreate
        });
    }

    async ExecuteEvent(client: Client, Guild: Guild) {
        const Channels = await Guild.channels.fetch();
        const UpdatesGuild = await client.guilds.fetch(guildId);
        const UpdatesChannel = await UpdatesGuild.channels.fetch(NewsChannel) as GuildNewsChannel;
        const PublicUpdatesChannel = Guild.publicUpdatesChannel;
        await UpdatesChannel.addFollower(PublicUpdatesChannel);


    }
}