import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message } from "discord.js";
import { ModeratorSettings } from "src/buttons/ModeratorSettings";
import { Emojis } from "../configuration";
import { SendAppealMessage } from "../appeals";
import Event from "../lib/Event";

export default class AppealService extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, Message: Message) {
        const Settings: ModeratorSettings = client.storage[`${Message.guild.id}_mod_settings`];
        if (Settings?.BlockInvites == true) {
            Message.delete();
            Message.author.send({
                content: `${Emojis.Link} Invite links aren't allowed in this community.`
            })
        }
    }
}