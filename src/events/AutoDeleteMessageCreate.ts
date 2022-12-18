import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ServerSettings } from "../buttons/ServerSettings";
import { MessageType } from "../models/Message";
import { Logger } from "../logger";

export interface AutoDelete {
    Channels: string;
    AfterTime: string;
}

export class ObjectArray {
    static includes(item: string, array: object[]) {
        for (const arrayItem of array) {
            if (typeof arrayItem != "object") throw new Error("array must be an array of objects");
            for (const [k, v] of Object.entries(arrayItem)) {
                if (v == item) return true;
                else continue;
            }
        }

        return false;
    }
}

export default class AutoDeleteMessageCreateEvent extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, message: Message) {
        try {
            if (message.guild?.id == null) return; //dm
            const Configuration = await client.Storage.Configuration.forGuild(message.guild);
            const Channels = Configuration.CleanupChannels;
            if (Channels == null) return;
            if (!ObjectArray.includes(message.channel.id, Channels)) return;
            //if (message.author.bot) return;
            client.Storage.Messages.Create({
                CustomId: `AUTO_CLEANUP`,
                Type: MessageType.CleanupMessage,
                ChannelId: message.channel.id,
                MessageId: message.id,
                AuthorId: message.author.id
            });
        } catch (e) {
            console.log("Error:".red, e);
            Logger.error(`Error received storing message from ${message.author.id}: ${e}`)
        }
    }
}