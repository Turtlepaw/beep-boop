import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, Events, GuildMember, Message as GuildMessage } from "discord.js";
import { ModeratorSettings } from "../buttons/ModeratorSettings";
import { Emojis, Icons } from "../configuration";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { Verifiers } from "@airdot/verifiers";
import { Logger } from "../logger";

export default class InviteBlocker extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, Message: GuildMessage) {
        if (Message.guild == null) return;
        //const Settings: ModeratorSettings = client.storage[`${Message.guild.id}_mod_settings`];
        const Configuration = await client.Storage.Configuration.forGuild(Message.guild);
        try {
            const isInviteLink = (await Verifiers.Web.InviteLink(Message.content)).result;
            if (Configuration.isInviteBlocker() && isInviteLink) {
                Message.delete();
                Message.author.send({
                    content: `${Icons.Link} Invite links aren't allowed in this community.`
                });

                /*const Messages = await Message.channel.messages.fetch();
                Messages.forEach(async (message: GuildMessage) => {
                    const InviteLink = Verifiers.InviteLink(message.content);
                    if (InviteLink) message.delete()
                })*/
            }
        } catch (e) {
            let content: string = Message?.content;
            if (content.length >= 30) content = (content.slice(0, 30) + "...");
            Logger.error(`Error recieved processing ${content}: ${e}`)
        }
    }
}