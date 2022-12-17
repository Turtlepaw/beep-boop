import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, TextBasedChannel, time, TimestampStyles } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ResolveUser } from "../utils/Profile";
import { RepMod } from "../buttons/RepMod";
import { Colors, Embed } from "../configuration";
import { ReputationBasedModerationType } from "../models/Configuration";
import { JSONArray } from "../utils/jsonArray";

export default class RepModJoin extends Event {
    constructor() {
        super({
            EventName: Events.GuildMemberAdd
        });
    }

    async ExecuteEvent(client: Client, member: GuildMember) {
        const Profile = await ResolveUser(member.id, client);
        const Settings = await client.Storage.Configuration.forGuild(member.guild);
        if (Settings == null) return;

        if (JSONArray.isArray(Settings.ModerationType) && Settings.ModerationType.includes(ReputationBasedModerationType.AsWarn) && Profile.reputation < 1) {
            const WarnChannel = await member.guild.channels.fetch(Settings.ModerationChannel) as TextBasedChannel;

            WarnChannel.send({
                embeds: [
                    new Embed(member.guild)
                        .setTitle("Suspicious Member Detected")
                        .setDescription(`We've detected a suspicious member that has joined ${time(member.joinedAt, TimestampStyles.RelativeTime)}.`)
                        .addFields([{
                            name: `Member`,
                            value: `${member}`
                        }, {
                            name: `Created`,
                            value: `${time(member.user.createdAt, TimestampStyles.RelativeTime)}`
                        }, {
                            name: `Reputation`,
                            value: Profile.reputation.toString()
                        }, {
                            name: `More Details`,
                            value: `• Display Name: ${Profile.displayName}`
                        }, {
                            name: `About ${member.user.username}`,
                            value: Profile.bio
                        }])
                        .setColor(Colors.Transparent)
                ]
            });
        }

        if (JSONArray.isArray(Settings.ModerationType) && (
            Settings.ModerationType.includes(ReputationBasedModerationType.AsBan) ||
            Settings.ModerationType.includes(ReputationBasedModerationType.AsKick)
        ) && Profile.reputation < Settings.MaxReputation) {
            const reason = `(Reputation-Based Moderation) Member had less than ${Settings.MaxReputation} (${Profile.reputation})`;
            if (Settings.ModerationType.includes(ReputationBasedModerationType.AsBan)) {
                member.ban({
                    reason
                });
            } else if (Settings.ModerationType.includes(ReputationBasedModerationType.AsKick)) {
                member.kick(reason);
            }

        }
    }
}