import { ActionRow, ActionRowBuilder, AnySelectMenuInteraction, bold, ButtonBuilder, ButtonStyle, channelMention, ChannelType, Client, Colors, CommandInteraction, ComponentType, inlineCode, ModalBuilder, PermissionsBitField, roleMention, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Embed, Icons, Messages, Permissions } from "../configuration";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { BackComponent, ButtonBoolean, StatusBoolean, StringBoolean, TextBoolean } from "../utils/config";
import ms from "ms";
import { ButtonCollector, Filter, GenerateIds } from "../utils/filter";
import { DisableButtons, ResolvedComponent, ResolveComponent } from "@airdot/activities/dist/utils/Buttons";
import { CleanupType, VerificationLevel } from "../models/Configuration";
import { JSONArray } from "../utils/jsonArray";
import { ModuleInformation, Modules } from "../commands/Server";
import { ChannelSelectMenu, RoleSelector, Selector, StringSelectBuilder, StringSelector } from "../utils/components";
import { generateId } from "../utils/Id";
import { FriendlyInteractionError } from "../utils/error";

const Module = ModuleInformation.SERVER_VERIFICATION;
export function GetEmoji(client: Client, module: Modules) {
    const Information = ModuleInformation[module];
    const EmojiId = /<(a)?:\w+:(\d{19})>/ig.exec(Information.Icon)[2];
    const Emoji = client.emojis.cache.get(EmojiId);
    return {
        Resolved: Emoji,
        Id: EmojiId
    }
}

export default class VerificationConfiguration extends SelectOptionBuilder {
    constructor() {
        super({
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: Permissions.Manager,
            Value: Modules.Verification
        });
    }

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client, values: string[]) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        let Verification = Configuration.Verification.Status;
        let Roles = Configuration.Verification.Roles;
        let Level = Configuration.Verification.Level;

        if (Configuration?.CustomId == null) {
            console.log("fixing guild", Configuration)
            // client.Storage.Configuration.Edit({
            //     Id: interaction.guild.id
            // }, {
            //     CustomId: Number(generateId(10))
            // });
        }

        enum Id {
            ToggleModule = "TOGGLE_MODULE",
            AddRole = "ADD_ROLE",
            RemoveRole = "REMOVE_ROLE",
            LevelButton = "LEVEL_BUTTON",
            AddRoleSelector = "ROLE_SELECTOR",
            RemoveRoleSelector = "REMOVE_ROLE_SELECTOR",
            LevelSelector = "LEVEL_SELECTOR"
        }

        const SelectorComponents = {
            AddRole: new RoleSelector()
                .SetCustomId(Id.AddRoleSelector)
                .Configure(e => e.setPlaceholder("Add a role")),
            RemoveRole: new StringSelector()
                .SetCustomId(Id.RemoveRoleSelector)
                .AddOptions(
                    ...await Promise.all(Configuration.Verification.Roles.map(async e => {
                        const Role = await interaction.guild.roles.fetch(e);
                        return new StringSelectBuilder()
                            .setLabel(Role.name)
                            .setValue(Role.id)
                    }))
                ),
            LevelSelector: new StringSelector()
                .SetCustomId(Id.LevelSelector)
                .AddOptions(
                    ...Object.entries(VerificationLevel).map(([k, v]) =>
                        new StringSelectBuilder()
                            .setLabel(v)
                            .setValue(k)
                            .setDefault(v == Level)
                    )
                )
                .Configure(e => e.setPlaceholder("Select a level"))
        }

        const Components = () => [
            new ButtonBuilder()
                .setCustomId(Id.ToggleModule)
                .setLabel(`${StringBoolean(Verification, false, "Module")}`)
                .setStyle(
                    ButtonBoolean(Verification)
                ),
            new ButtonBuilder()
                .setCustomId(Id.AddRole)
                .setLabel(`Add Role`)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(Id.RemoveRole)
                .setLabel(`Remove Role`)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(Id.LevelButton)
                .setLabel(`Select Level`)
                .setStyle(ButtonStyle.Secondary)
        ];

        const Emoji = GetEmoji(client, Modules.Verification);
        const GenerateEmbed = () => new Embed(interaction.guild)
            .setTitle("Managing Verification")
            .setThumbnail(Emoji.Resolved.url ?? null)
            .addFields([{
                name: `About Verification`,
                value: Module.Description
            }, {
                name: "Current Configuration",
                value: `
${TextBoolean(Verification, `Module ${StringBoolean(Verification, false)}`)}
${Icons.StemItem} Level: ${Level}
${Icons.StemEnd} Roles: ${(Roles == null || Roles.length == 0) ? "None" : Roles.map(e => roleMention(e)).join(" ")}`
            }]);

        const Message = await interaction.update({
            fetchReply: true,
            embeds: [
                GenerateEmbed()
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        BackComponent,
                        ...Components()
                    )
            ]
        });

        const Save = async () => {
            await client.Storage.Configuration.Edit(Configuration.CustomId, {
                Verification: Verification,
                VerificationLevel: Level,
                VerificationRoles: Roles
            });

            await Message.edit({
                embeds: [
                    GenerateEmbed()
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            BackComponent,
                            ...Components()
                        )
                ]
            });
        }

        const Collector = Message.createMessageComponentCollector({
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: [...GenerateIds(Id), ButtonCollector.BackButton]
            })
        });

        Collector.on("collect", async button => {
            if (button.isButton() && button.customId == Id.ToggleModule) {
                Verification = true;
                await Save()
                await button.reply(Messages.Saved);
            } else if (button.isButton() && button.customId == Id.LevelButton) {
                const ButtonMessage = await button.reply({
                    ephemeral: true,
                    fetchReply: true,
                    components: [SelectorComponents.LevelSelector.toActionRow()],
                    content: `${Icons.Flag} Select a verification level.`
                });

                const SelectMenu = await ButtonMessage.awaitMessageComponent({
                    filter: Filter({
                        customIds: Id,
                        member: interaction.member
                    }),
                    componentType: ComponentType.StringSelect
                });

                const VerifyLevel = VerificationLevel[SelectMenu.values[0]];
                Level = VerifyLevel;
                await Save();
                await SelectMenu.update(Messages.Saved);
            } else if (button.isButton() && button.customId == Id.AddRole) {
                const ButtonMessage = await button.reply({
                    fetchReply: true,
                    ephemeral: true,
                    components: [SelectorComponents.AddRole.toActionRow()],
                    content: `${Icons.Flag} Select a role to add to add to verified members.`
                });

                const SelectMenu = await ButtonMessage.awaitMessageComponent({
                    filter: Filter({
                        customIds: Id,
                        member: interaction.member
                    }),
                    componentType: ComponentType.RoleSelect
                });

                const Role = SelectMenu.roles.first();
                Roles.push(Role.id);
                await Save();
                await SelectMenu.update(Messages.Saved);
            } else if (button.isButton() && button.customId == Id.RemoveRole) {
                if (Roles == null || Roles.length == 0) {
                    await FriendlyInteractionError(button, "You don't have any roles to remove.");
                    return;
                }
                const ButtonMessage = await button.reply({
                    fetchReply: true,
                    ephemeral: true,
                    components: [SelectorComponents.RemoveRole.toActionRow()],
                    content: `${Icons.Flag} Select a role to remove.`
                });

                const SelectMenu = await ButtonMessage.awaitMessageComponent({
                    filter: Filter({
                        customIds: Id,
                        member: interaction.member
                    }),
                    componentType: ComponentType.StringSelect
                });

                const Role = await interaction.guild.roles.fetch(SelectMenu.values[0]);
                Roles = Roles.filter(e => e != Role.id);
                await Save();
                await SelectMenu.update(Messages.Saved);
            }
        });

        ButtonCollector.AttachBackButton(Collector);
    }
}