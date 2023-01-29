import { Client, Events, Interaction, time, TimestampStyles } from "discord.js";
import Event from "../lib/Event";
import { RedeemCodeModal } from "../buttons/Subscription/RedeemCode";
import { RedeemGiftAndExpire, ResolveGift } from "../utils/Gift";
import { FriendlyInteractionError } from "../utils/error";
import { SetSubscription } from "../utils/Profile";
import { GetSubscriptionName } from "../buttons/Developer/CreateGift";
import { LogSnagChannels } from "../@types/logsnag";

export default class AppealModal extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, ModalInteraction: Interaction) {
        if (!ModalInteraction.isModalSubmit()) return;
        if (ModalInteraction.customId != RedeemCodeModal) return;
        const Fields = {
            Code: ModalInteraction.fields.getTextInputValue("CODE")
        }

        const Gift = await ResolveGift(Fields.Code, client);

        if (Gift.gift == null) {
            await FriendlyInteractionError(ModalInteraction, "Gift not found.")
            return;
        }

        if (Gift.Redeemed) {
            await FriendlyInteractionError(ModalInteraction, "Seems like someone already claimed this gift!")
            return;
        }

        if (Gift.Expired) {
            await FriendlyInteractionError(ModalInteraction, `That gift expired ${time(Gift.Expires, TimestampStyles.RelativeTime)}`)
            return;
        }

        const expires = new Date();
        expires.setMonth(expires.getMonth() + 2)
        SetSubscription(ModalInteraction.user.id, Gift.Type, expires, client);
        RedeemGiftAndExpire(Fields.Code, client);

        await ModalInteraction.reply({
            ephemeral: true,
            content: `🎉 ${GetSubscriptionName(Gift.Type)} subscription from <@${Gift.From}> activated!`
        });

        await client.LogSnag.publish({
            channel: LogSnagChannels.Subscriptions,
            event: "Subscription Activated",
            description: `${ModalInteraction.user.tag} redeemed gift from ${Gift.From}`,
            icon: "🚀",
            tags: {
                user: ModalInteraction.user.tag,
                from: Gift.From
            }
        });
    }
}