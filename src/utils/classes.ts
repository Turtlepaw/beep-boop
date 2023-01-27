import { InteractionReplyOptions, MessagePayload, RepliableInteraction } from "discord.js";

export class ArrayUtils {
    static AdvancedSearch<T>(array: T[], finder: (item: T) => boolean) {
        for (const item of array) {
            const result = finder(item);
            if (result == true) return {
                Result: true,
                Item: item
            };
            else continue;
        }

        return {
            Result: false,
            Item: null
        };
    }
}

export class InteractionReplyManager {
    public interaction: RepliableInteraction;
    constructor(interaction: RepliableInteraction) {
        this.interaction = interaction;
    }

    send(payload: string | InteractionReplyOptions | MessagePayload, strict?: boolean) {
        if (!strict && (this.interaction.replied || this.interaction.deferred)) {
            return this.interaction.editReply(payload);
        } else return this.interaction.reply(payload);
    }
}