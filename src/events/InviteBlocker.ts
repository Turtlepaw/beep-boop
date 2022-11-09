import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message as GuildMessage } from "discord.js";
import { ModeratorSettings } from "src/buttons/ModeratorSettings";
import { Emojis } from "../configuration";
import { SendAppealMessage } from "../appeals";
import Event from "../lib/Event";
import { Verifiers } from "../verify";

export default class AppealService extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, Message: GuildMessage) {
        const Settings: ModeratorSettings = client.storage[`${Message.guild.id}_mod_settings`];
        const isInviteLink = await Verifiers.InviteLink(Message.content);
        if (Settings?.BlockInvites == true && isInviteLink) {
            Message.delete();
            Message.author.send({
                content: `${Emojis.Link} Invite links aren't allowed in this community.`
            });

            /*const Messages = await Message.channel.messages.fetch();
            Messages.forEach(async (message: GuildMessage) => {
                const InviteLink = Verifiers.InviteLink(message.content);
                if (InviteLink) message.delete()
            })*/
        }
    }
}