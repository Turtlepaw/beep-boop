import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, Events, GuildMember, Message as GuildMessage } from "discord.js";
import { Embed, Emojis, guildId, Logs } from "../configuration";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { Verifiers } from "../utils/verify";

export default class DMService extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, Message: GuildMessage) {
        if (Message.channel.type != ChannelType.DM) return;
        if (Logs.DM == null) return;
        const Guild = await client.guilds.fetch(guildId);
        const Channel = await Guild.channels.fetch(Logs.DM);
        if (Channel.type != ChannelType.GuildText) throw Error("Logs.DM must be a text channel id");
        if (Message.author.id == client.user.id) return;

        await Channel.send({
            embeds: [
                new Embed()
                    .setTitle(`${Emojis.TextChannel} DM Received!`)
                    .setDescription(`${Emojis.Information} *If there are embeds below, those are the embeds received in the DM.*`)
                    .addFields([{
                        name: "Message Content",
                        value: Message.content
                    }]),
                ...(Message.embeds != null ? Message.embeds : [])
            ]
        });
    }
}