import { ChannelType, Client, Events, Message as GuildMessage } from "discord.js";
import { Embed, guildId, Icons, Logs } from "../configuration";
import Event from "../lib/Event";
import { Logger } from "../logger";

export default class DMService extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, Message: GuildMessage) {
        try {
            if (Message.channel.type != ChannelType.DM) return;
            if (Logs.DM == null) return;
            const Guild = await client.guilds.fetch(guildId);
            const Channel = await Guild.channels.fetch(Logs.Guild);
            if (Channel.type != ChannelType.GuildText) throw Error("Logs.DM must be a text channel id");
            if (Message.author.id == client.user.id) return;

            await Channel.send({
                embeds: [
                    new Embed(Message.guild)
                        .setTitle(`${Icons.Channel} DM Received!`)
                        .setDescription(`${Icons.Info} *If there are embeds below, those are the embeds received in the DM.*`)
                        .addFields([{
                            name: `${Icons.Quotes} Message Content`,
                            value: Message.content
                        }]),
                    ...(Message.embeds != null ? Message.embeds : [])
                ]
            });
        } catch (e) {
            Logger.error(`Failed forwarding DM: ${e}`);
        }
    }
}