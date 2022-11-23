import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Events, GuildMember, TextBasedChannel, time, TimestampStyles } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Event from "../lib/Event";
import { ResolveUser } from "../utils/Profile";
import { RepMod } from "../buttons/RepMod";
import { Colors, Embed } from "../configuration";

export default class RepModJoin extends Event {
    constructor() {
        super({
            EventName: Events.GuildMemberAdd
        });
    }

    async ExecuteEvent(client: Client, member: GuildMember) {
        const Profile = await ResolveUser(member.id, client);
        const Settings = client.Storage.Get<RepMod>(`${member.guild.id}_rep_mod`);
        if (Settings == null) return;

        if (Settings.isWarn && Profile.reputation < 1) {
            const WarnChannel = await member.guild.channels.fetch(Settings.WarnChannel) as TextBasedChannel;

            WarnChannel.send({
                embeds: [
                    new Embed()
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

        if (Settings.isBan && Profile.reputation < Settings.BanAfter) {
            member.ban({
                reason: `(Reputation-Based Moderation) Member had less than ${Settings.BanAfter} (${Profile.reputation})`
            });
        }
    }
}