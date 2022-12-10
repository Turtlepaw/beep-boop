import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, Message as GuildMessage } from "discord.js";
import { Emojis } from "../configuration";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { Verifiers } from "../utils/verify";
import { ServerSettings } from "src/buttons/ServerSettings";

export default class LevelService extends Event {
    constructor() {
        super({
            EventName: Events.MessageCreate
        });
    }

    async ExecuteEvent(client: Client, Message: GuildMessage) {
        if (Message.author.bot) return;
        if (Message.guild == null) return;
        const Settings: ServerSettings = client.storage[`${Message.guild.id}_server_settings`]
        if (Settings?.Levels == null || Settings?.Levels == false) return;
        const Levels = client.Levels;
        const Current = await Levels.Level(Message.author.id, Message.guild.id);
        const AddedXP = Levels.TargetXP(Current.Level);
        const LevelUp = await Levels.AddXP(Message.author.id, Message.guild.id, AddedXP);

        if (LevelUp.HasLeveledUp) {
            Message.reply({
                content: `${Emojis.Tada} Congrats ${Message.author}! You just leveled up to level ${LevelUp.CurrentLevel}.`
            });
        }
    }
}