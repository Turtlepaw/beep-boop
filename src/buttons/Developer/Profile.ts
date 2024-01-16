import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, userMention } from "discord.js";
import { FriendlyInteractionError } from "../../utils/error";
import { ClientAdministrators, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { ActionRowHandler, StringSelectBuilder, StringSelector } from "../../utils/components";
import { LogSnagChannels } from "../../@types/logsnag";
import { ButtonIds } from "./Developer";
import { Endorse, ResolveUser, SetVerified } from "@utils/Profile";
import { ViewProfile } from "@commands/Other/Profile";

export default class ProfileInfo extends Button {
    constructor() {
        super({
            CustomId: ButtonIds.Profiles,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        if (!ClientAdministrators.includes(interaction.user.id)) return FriendlyInteractionError(interaction, "You're not authorized to use this.");
        enum Fields {
            UserId = "USER_ID",
            Reputation = "REPUTATION_FIELD"
        }
        const Modal = new ModalBuilder()
            .setTitle("Profile ID")
            .setCustomId("PROFILE_ID")
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .setComponents(
                        new TextInputBuilder()
                            .setLabel("User ID")
                            .setCustomId(Fields.UserId)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    )
            );

        const RepModal = new ModalBuilder()
            .setTitle("Profile Reputation")
            .setCustomId("PROFILE_REP")
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .setComponents(
                        new TextInputBuilder()
                            .setLabel("Reputation")
                            .setCustomId(Fields.Reputation)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    )
            );

        await interaction.showModal(Modal);
        const modal = await interaction.awaitModalSubmit({
            time: 0
        });

        const UserId = modal.fields.getTextInputValue(Fields.UserId);
        const Profile = await ResolveUser(UserId, client);
        enum Id {
            SetReputation = "SET_REPUTATION",
            SetVerified = "SET_VERIFIED",
            VerifiedBooleanSelect = "VERIFIED_BOOLEAN_SELECTOR"
        }

        const Components = new ActionRowHandler(
            new ButtonBuilder()
                .setLabel("Set Reputation")
                .setCustomId(Id.SetReputation)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setLabel("Set Verified")
                .setCustomId(Id.SetVerified)
                .setStyle(ButtonStyle.Secondary)
        );

        const Message = await modal.reply({
            embeds: [
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await ViewProfile(interaction as any, undefined, Profile, true)
            ],
            ephemeral: true,
            fetchReply: true,
            components: Components.toComponents()
        });

        const Button = await Components.collect(Message, ComponentType.Button, interaction);

        if (Button.customId == Id.SetReputation) {
            await Button.showModal(RepModal);
            const repModal = await Button.awaitModalSubmit({
                time: 0
            });

            const newRep = repModal.fields.getTextInputValue(Fields.Reputation);

            await Endorse(UserId, client, Number(newRep), true);

            await repModal.reply({
                ephemeral: true,
                content: `${Icons.Success} Added ${Number(newRep)} to ${userMention(UserId)}.`
            });
        } else if (Button.customId == Id.SetVerified) {
            const Booleans = {
                "1": true,
                "2": false
            }
            const SelectMenu = new StringSelector()
                .SetCustomId(Id.VerifiedBooleanSelect)
                .AddOptions(
                    new StringSelectBuilder()
                        .setLabel("True")
                        .setValue("1"),
                    new StringSelectBuilder()
                        .setLabel("False")
                        .setValue("2")
                )
                .Min(1)
                .Max(1);

            const Message = await Button.reply({
                content: `${Icons.ConfigureAdvanced} Select if they should be verified.`,
                components: SelectMenu.toComponents(),
                fetchReply: true,
                ephemeral: true
            });

            const Select = await SelectMenu.CollectComponents(Message, Button);
            const boolean = Booleans[Select.values[0]];

            await SetVerified(UserId, boolean, client);

            await Select.update({
                content: `${Icons.Success} ${userMention(UserId)} is ${boolean == true ? "now verified" : "no longer verified"}.`
            });

            const resolvedUser = client.users.cache.get(UserId);
            const usertag = resolvedUser?.tag ?? UserId;

            await client.LogSnag.publish({
                channel: LogSnagChannels.Verification,
                event: `New ${boolean == true ? "V" : "Unv"}erified User`,
                description: `${usertag} just got ${boolean == true ? "v" : "unv"}erified`,
                icon: "✔️",
                tags: {
                    user: usertag,
                    verified: boolean
                }
            });
        }
    }
}
