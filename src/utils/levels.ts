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

export class Levels {
    public storage: Storage;
    constructor(storage: Storage) {
        this.storage = storage;
    }

    CreateMember(Id: string, GuildId: string) {
        const Item = {
            GuildId,
            Id,
            LastUpdated: new Date(),
            Level: 1,
            XP: 0
        };

        this.storage[
            this.CreateId(Id, GuildId)
        ] = Item;

        return Item;
    }

    SetLevel(Id: string, GuildId: string, Level: number) {
        let Current = this.Level(Id, GuildId);
        this.storage[
            this.CreateId(Id, GuildId)
        ] = {
            ...(Current || {}),
            LastUpdated: new Date(),
            Level: Level
        };
    }

    AddXP(Id: string, GuildId: string, xp: number) {
        let Current = this.Level(Id, GuildId);
        //const NewLevel = Math.floor(0.1 * Math.sqrt(xp));
        let NewLevel = xp >= 100 ? (Current.Level + 1) : Current.Level;
        let NewXP = (NewLevel > Current.Level) ? 0 : (xp + Current.XP); //old: xp + parseInt(xp.toString(), 10);

        if (NewXP >= 100) {
            NewXP = 0;
            NewLevel = Current.Level + 1;
        };

        this.storage[
            this.CreateId(Id, GuildId)
        ] = {
            ...(Current || {}),
            LastUpdated: new Date(),
            Level: NewLevel,
            XP: NewXP
        };
        return {
            HasLeveledUp: NewLevel > Current.Level,
            CurrentXP: NewXP,
            CurrentLevel: NewLevel
        };
    }

    Level(Id: string, GuildId: string): Member {
        let Current = this.storage[
            this.CreateId(Id, GuildId)
        ];
        if (Current == null) Current = this.CreateMember(Id, GuildId);
        return {
            GuildId: Current.GuildId,
            Id: Current.Id,
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