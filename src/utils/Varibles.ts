import { Guild, GuildMember } from "discord.js";

export const Varibles: Record<string, {
    Run: (guild: Guild) => string;
    Name: string
}> = {
    MemberCount: {
        Name: "{&MemberCount}",
        Run: (guild) => guild.memberCount.toString()
    },
    HumanCount: {
        Name: "{&HumanCount}",
        Run: (guild) => guild.members.cache.filter(e => !e.user.bot).size.toString()
    },
    BotCount: {
        Name: "{&BotCount}",
        Run: (guild) => guild.members.cache.filter(e => e.user.bot).size.toString()
    }
}
export const Varible = "{&count}";
export const VaribleRegEx = /(({&))((\w+))(})?$/igm;

export function FilterVaribles(text: string) {
    return text.matchAll(VaribleRegEx);
}

export function ReplaceVaribles(text: string[], replacers: Record<string, (text: string) => string>) {
    return text.map(e => replacers[e](e))
}

export class VaribleRunner {
    public text: string;

    constructor(text: string) {
        this.text = text;
    }

    run({ guild, member }: {
        guild: Guild;
        member?: GuildMember;
    }) {
        const text = this.text;
        Object.values(Varibles).map(e => {
            text.replaceAll(e.Name, e.Run(guild))
        });

        return text;
    }
}
