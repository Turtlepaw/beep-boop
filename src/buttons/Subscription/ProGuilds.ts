import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, Guild, SelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js";
import { FriendlyInteractionError } from "../../utils/error";
import { Embed, Icons, Permissions } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { AddGuild, RemoveGuild, ResolveUser } from "../../utils/Profile";
import { Subscriptions } from "../../models/Profile";

export default class SubscriptionManageGuilds extends Button {
    constructor() {
        super({
            CustomId: "SUBSCRIPTION_GUILDS",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        await interaction.deferReply({ ephemeral: true });
        const Profile = await ResolveUser(interaction.user.id, client);
        const ProfileGuilds: Set<string> = Profile.guilds ?? new Set();
        if (Profile.subscription == Subscriptions.None) return FriendlyInteractionError(interaction, "You don't have an active subscription on your account.")
        enum Id {
            RemoveGuildSelector = "REMOVE_A_GUILD_SELECTOR",
            AddGuildSelector = "ADD_A_GUILD_SELECTOR",
            RemoveGuild = "REMOVE_GUILD_BTN",
            AddGuild = "ADD_GUILD_BTN",
        }
        const guilds = await Promise.all((await client.guilds.fetch()).filter(async e => {
            const resolved = await client.guilds.fetch(e.id);
            const member = await resolved.members.fetch(interaction.user);
            return member.permissions.any([
                ...Permissions.Manager,
                ...Permissions.Moderator
            ]) && (Profile.guilds == null ? true : !Profile.guilds.has(e.id));
        }).map(e => client.guilds.fetch(e.id)));

        const AddGuildSelector = new StringSelectMenuBuilder()
            .addOptions(
                guilds.map(e =>
                    new SelectMenuOptionBuilder()
                        .setLabel(e.name)
                        .setValue(e.id)
                )
            )
            .setCustomId(Id.AddGuildSelector)
            .setPlaceholder("Add a server...")
            .setMaxValues(1)
            .setMinValues(1);

        const PremiumGuilds: Guild[] = [];
        if (Profile?.guilds != null && Profile?.guilds != undefined) for (const ProGuild of Profile.guilds.values()) {
            const resolved = await client.guilds.fetch(ProGuild);
            PremiumGuilds.push(resolved)
        }

        const RemoveGuildSelector = new StringSelectMenuBuilder()
            .addOptions(
                PremiumGuilds.map(e =>
                    new SelectMenuOptionBuilder()
                        .setLabel(e.name)
                        .setValue(e.id)
                )
            )
            .setCustomId(Id.RemoveGuildSelector)
            .setPlaceholder("Remove a server...")
            .setMaxValues(1)
            .setMinValues(1);

        const GetEmbed = async () => {
            const CreatedEmbed = new Embed(interaction)
                .setTitle("Manage Premium Servers")
                .setDescription("Select servers to activate premium on.")
            if (ProfileGuilds != null && ProfileGuilds.size >= 1) CreatedEmbed.addFields(
                PremiumGuilds.map(e => ({
                    name: e.name,
                    value: "You've enabled premium on this server."
                }))
            );

            return CreatedEmbed;
        }

        const Components = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Add Server")
                    .setCustomId(Id.AddGuild)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel("Remove Server")
                    .setCustomId(Id.RemoveGuild)
                    .setStyle(ButtonStyle.Danger)
            );

        const Message = await interaction.editReply({
            embeds: [
                await GetEmbed()
            ],
            components: [Components]
        });

        const Collector = Message.createMessageComponentCollector({
            time: 0
        });

        Collector.on("collect", async button => {
            if (button.isButton()) {
                const Selector = button.customId == Id.AddGuild ? AddGuildSelector : RemoveGuildSelector;
                if (button.customId == Id.RemoveGuild && PremiumGuilds.length == 0) {
                    button.reply({
                        ephemeral: true,
                        content: `${Icons.Error} You have no premium servers to remove.`
                    })
                    return;
                }

                await button.update({
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                Selector
                            )
                    ]
                });
            } else if (button.isStringSelectMenu()) {
                enum Types {
                    Remove = "Removed",
                    Add = "Added"
                }

                let Type: Types;
                if (button.customId == Id.AddGuildSelector) {
                    Type = Types.Add;
                    const GuildId = button.values[0];
                    ProfileGuilds.add(GuildId)
                    const Configuration = await client.Storage.Configuration.forGuild({
                        id: GuildId,
                        name: "Unknown Guild"
                    });
                    await AddGuild(interaction.user.id, GuildId, client);
                    await client.Storage.Configuration.Edit(Configuration.CustomId, {
                        Premium: true
                    });
                } else if (button.customId == Id.RemoveGuildSelector) {
                    Type = Types.Remove;
                    const GuildId = button.values[0];
                    ProfileGuilds.delete(GuildId);
                    const Configuration = await client.Storage.Configuration.forGuild({
                        id: GuildId,
                        name: "Unknown Guild"
                    });
                    await RemoveGuild(interaction.user.id, GuildId, client);
                    await client.Storage.Configuration.Edit(Configuration.CustomId, {
                        Premium: false
                    });
                }

                await button.update({
                    embeds: [
                        await GetEmbed()
                    ],
                    components: [
                        Components
                    ]
                });

                await button.followUp({
                    ephemeral: true,
                    content: `${Icons.Configure} ${Type} the server's premium.`
                });
            }
        })
    }
}