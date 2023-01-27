import { Client, Events, GuildMember } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";

export default class LeaveAppealMessage extends Event {
    constructor() {
        super({
            EventName: Events.GuildMemberRemove
        });
    }

    async ExecuteEvent(client: Client, member: GuildMember) {
        //const channel = await member.createDM(true);
        const bans = await member.guild.bans.fetch();
        if (!bans.has(member.id)) return;
        await SendAppealMessage(member);
    }
}