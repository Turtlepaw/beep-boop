import { Client, Events, GuildMember } from "discord.js";
import Event from "../lib/Event";
import { FeedbackManager } from "@selects/LeaveFeedback";

export default class LeaveFeedback extends Event {
    constructor() {
        super({
            EventName: Events.GuildMemberRemove
        });
    }

    async ExecuteEvent(client: Client, member: GuildMember) {
        const Feedback = new FeedbackManager(member);
        const Message = await Feedback.send(null);
        if (Message == null) return;

        client.QuickStorage[`f${Message.id}`] = member.guild.id;
    }
}
