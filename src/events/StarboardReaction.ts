/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChannelType, Client, Events, MessageReaction, User } from "discord.js";
import Event from "../lib/Event";

export default class TicketService extends Event {
    constructor() {
        super({
            EventName: Events.MessageReactionAdd
        });
    }

    async ExecuteEvent(client: Client, Reaction: MessageReaction, user: User) {
        // 1. Check if the guild has the feature enabled
        // 2. Send a starboard message
        const Config = await client.Storage.Configuration.forGuild(Reaction.message.guild);
        if (!Config.hasStarboard()) return;
        const Message = await Reaction.message.fetch();
        if (Message.reactions.cache.size < Config.Starboard.ReactionCount) return;
        const Channel = await Message.guild.channels.fetch(Config.Starboard.Channel);
        if (!Channel.isTextBased()) return;
        Channel.send({

        })
    }
}