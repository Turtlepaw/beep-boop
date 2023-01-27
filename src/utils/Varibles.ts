import { Guild, GuildMember, User } from "discord.js";

export interface Varible<T> {
    Run: (t: T) => string;
    Name: string
}

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
}

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

export type InputType = "Member" | "User" | "Guild";
export function DocGen<Result = string>(
    //@ts-expect-error this is the default when Result is null and resolveInput is null
    resolveInput: (name: string, varible: Varible<unknown>, type: InputType) => Result = (n, v) => `• ${n} (${v.Name})`
) {
    return (Object.entries(Varibles) as [string, GenericVaribles][]).map(([k, v]) => {
        return Object.entries(v).map(([k2, v2]) => {
            return resolveInput(k2, v2, k as InputType);
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

    async run({ guild, member, user }: {
        guild?: Guild;
        member?: GuildMember;
        user?: User;
    }) {
        if (member != null && user == null) user = member.user;
        const value = [member != null ? "member" : (user != null ? "user" : null), guild != null ? "guild" : null].filter(e => e != null);
        let text = this.text;

        await Promise.all(
            [
                ...(value.includes("member") ? Object.values(Varibles.Member) : []),
                ...(value.includes("user") ? Object.values(Varibles.User) : []),
                ...(value.includes("guild") ? Object.values(Varibles.Guild) : [])
            ].filter(e => e != null).map(async v => {
                let arg;
                if (Object.values(Varibles.Member).map(e => e.Name).includes(v.Name)) arg = member;
                if (Object.values(Varibles.Guild).map(e => e.Name).includes(v.Name)) arg = guild;
                if (Object.values(Varibles.User).map(e => e.Name).includes(v.Name)) arg = user;
                return text = text.replaceAll(v.Name, v.Run(arg));
            })
        );

        return text;
    }
}
