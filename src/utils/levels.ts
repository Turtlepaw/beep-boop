import { MemberRanking } from "../models/MemberRanking";
import { DataSource, Repository } from "typeorm";
import { StorageManager } from "./Storage";

export interface Member {
    Level?: number;
    LastUpdated?: Date;
    GuildId?: string;
    Id?: string;
    XP?: number;
}

export interface Storage {
    [key: string]: Member | null;
}

const RankingRepository = "GuildRankings";

export class Levels {
    public storage: DataSource;
    public repo: Repository<MemberRanking>;
    public manager: StorageManager<MemberRanking>;
    constructor(storage: DataSource) {
        this.storage = storage;
        this.repo = storage.getRepository(RankingRepository);
        this.manager = new StorageManager(storage, MemberRanking.name);
    }

    CreateMember(Id: string, GuildId: string) {
        const Item = {
            GuildId,
            MemberId: Id,
            LastUpdated: new Date(),
            Level: 1,
            XP: 0
        };

        return this.repo.create({
            CustomId: this.CreateId(Id, GuildId),
            ...Item
        });
    }

    SetLevel(Id: string, GuildId: string, Level: number) {
        //let Current = this.Level(Id, GuildId);
        this.repo.update(this.CreateId(Id, GuildId), {
            LastUpdated: new Date(),
            Level: Level
        });
    }

    async AddXP(Id: string, GuildId: string, xp: number) {
        const Current = await this.Level(Id, GuildId);
        //const NewLevel = Math.floor(0.1 * Math.sqrt(xp));
        let NewLevel = xp >= 100 ? (Current.Level + 1) : Current.Level;
        let NewXP = (NewLevel > Current.Level) ? 0 : (xp + Current.XP); //old: xp + parseInt(xp.toString(), 10);

        if (NewXP >= 100) {
            NewXP = 0;
            NewLevel = Current.Level + 1;
        }

        this.repo.update(this.CreateId(Id, GuildId), {
            LastUpdated: new Date(),
            Level: NewLevel,
            XP: NewXP
        })

        return {
            HasLeveledUp: NewLevel > Current.Level,
            CurrentXP: NewXP,
            CurrentLevel: NewLevel
        };
    }

    async Level(Id: string, GuildId: string): Promise<Member> {
        let Current = await this.repo.findOneBy({
            CustomId: this.CreateId(Id, GuildId)
        });

        if (Current == null) Current = this.CreateMember(Id, GuildId);
        return {
            GuildId: Current.GuildId,
            Id: Current.CustomId,
            LastUpdated: new Date(Current.LastUpdated),
            Level: Current.Level,
            XP: Current.XP
        }
    }

    TargetXP(CurrentLevel: number) {
        if (CurrentLevel < 48) {
            const Max = 52;
            const XP = Math.abs(CurrentLevel - Max);
            return XP;
        } else return 12;
    }

    private CreateId(Id: string, GuildId: string) {
        return `xp_${Id}_${GuildId}`;
    }
}