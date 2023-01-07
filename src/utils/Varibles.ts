import { Guild, GuildMember, User } from "discord.js";

export interface Varible<T> {
    Run: (t: T) => string;
    Name: string
};

export interface Varibles {
    Guild: {
        [key: string]: Varible<Guild>;
    };
    User: {
        [key: string]: Varible<User>;
    };
    Member: {
        [key: string]: Varible<GuildMember>;
    };
}

export type GenericVarible = Varible<GuildMember | User | Guild>;
export interface GenericVaribles {
    [key: string]: GenericVarible;
};

export const Varibles: Varibles = {
    Guild: {
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
    },
    Member: {
        Nickname: {
            Name: "{&Memberickname}",
            Run: (m) => m.nickname
        }
    },
    User: {
        Tag: {
            Name: "{&UserTag}",
            Run: (u) => u.tag
        },
        Username: {
            Name: "{&Username}",
            Run: (u) => u.username
        },
        Discriminator: {
            Name: "{&UserDiscriminator}",
            Run: (u) => u.discriminator
        }
    }
}

export function DocGen<Result>(
    //@ts-expect-error
    resolveInput: (name: string, varible: Varible<any>, type: "Member" | "User" | "Guild") => Result = (n, v, t) => `• ${n} (${v.Name})`
) {
    return (Object.entries(Varibles) as [string, GenericVaribles][]).map(([k, v]) => {
        return Object.entries(v).map(([k2, v2]) => {
            return resolveInput(k2, v2, k as any);
        })
    })
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

    run({ guild, member, user }: {
        guild?: Guild;
        member?: GuildMember;
        user?: User;
    }) {
        if (member != null && user == null) user = member.user;
        const value = [member != null ? "member" : (user != null ? "user" : null), guild != null ? "guild" : null].filter(e => e != null);
        const text = this.text;
        [
            ...(Object.values(value.includes("member") ? member : null)),
            ...(Object.values(value.includes("user") ? user : null)),
            ...(Object.values(value.includes("guild") ? guild : null))
        ].filter(e => e != null).map(v => {
            text.replaceAll(v.Name, v.Run(guild))
        });

        return text;
    }
}
