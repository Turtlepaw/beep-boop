import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildMember, Interaction, ModalSubmitInteraction } from "discord.js";
import { Filter } from "../utils/filter";
import { Embed } from "../configuration";
import Event from "../lib/Event";
import { RedeemCodeModal } from "../buttons/RedeemCode";
import { RedeemGiftAndExpire, ResolveGift } from "../utils/Gift";
import { FriendlyInteractionError } from "../utils/error";
import { SetSubscription } from "../utils/Profile";
import { Subscriptions } from "../models/Profile";

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
        };

        const expires = new Date();
        expires.setMonth(expires.getMonth() + 2)
        SetSubscription(ModalInteraction.user.id, Subscriptions.Pro, expires, client);
        RedeemGiftAndExpire(Fields.Code, client);

        await ModalInteraction.reply({
            ephemeral: true,
            content: "Subscription activated."
        });
    }
}