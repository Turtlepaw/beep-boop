import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { FriendlyInteractionError, InteractionError } from "../../utils/error";
import { ClientAdministrators, Embed, Messages } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { Subscriptions } from "../../models/Profile";
import { ButtonIds } from "./Developer";
import { ResolveUser, SetSubscription } from "../../utils/Profile";

export function enumKey(selectedEnum: object, selectedValue: string) {
    for (const [k, v] of Object.entries(selectedEnum)) {
        if (v == selectedValue) return k;
    }
}

export default class SubscriptionConfig extends Button {
    constructor() {
        super({
            CustomId: ButtonIds.Subscriptions,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        if (!ClientAdministrators.includes(interaction.user.id)) return FriendlyInteractionError(interaction, "You're not authorized to use this.");

        enum Fields {
            UserId = "USER_ID"
        }
        const ModalId = "SUB_USER_MODAL";
        const Modal = new ModalBuilder()
            .setCustomId(ModalId)
            .setTitle("Subscriptions")
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(Fields.UserId)
                            .setLabel("User ID")
                            .setMinLength(8)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    )
            );

        await interaction.showModal(Modal);

        const modal = await interaction.awaitModalSubmit({ time: 0 });
        const id = modal.fields.getTextInputValue(Fields.UserId);
        const cachedUser = await interaction.client.users.cache.get(id);
        if (cachedUser == null) return InteractionError({
            interaction: modal,
            createError: false,
            ephemeral: true,
            error: `CACHED_USER_NULLISH`,
            message: "Couldn't find user."
        });

        const User = await ResolveUser(
            id,
            interaction.client
        );

        enum Button {
            RemoveSubscription = "REMOVE_SUBSCRIPTION"
        }

        const Message = await modal.reply({
            embeds: [
                await new Embed(interaction)
                    .setTitle(User.displayName)
                    .setDescription(
                        enumKey(Subscriptions, User.subscription)
                    )
                    .Resolve()
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(Button.RemoveSubscription)
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Remove Subscription")
                            .setDisabled(User.subscription == Subscriptions.None)
                    )
            ],
            fetchReply: true,
            ephemeral: true
        });

        const btn = await Message.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button
        });

        if (btn.customId == Button.RemoveSubscription) {
            await SetSubscription(User.userId, Subscriptions.None, new Date(), interaction.client);
            await btn.reply(Messages.Success("Removed Subscription"));
        }
    }
}
