import {
    APIGuildMember,
    GuildMember,
    MessageComponentInteraction,
    InteractionCollector,
    CollectedInteraction,
    CacheType
} from "discord.js";
import { ButtonId } from "./config";

export type InteractionFilter = (interaction: MessageComponentInteraction) => boolean;
export interface FilterOptions {
    member: (APIGuildMember | GuildMember);
    customIds: (string[]) | object;
    debug?: boolean;
    messageId?: string;
    errorMessages?: boolean;
}

export function Filter({ customIds, member, debug, messageId, errorMessages }: FilterOptions): InteractionFilter {
    let ResolvedIds: string[];
    if (typeof customIds == "object") ResolvedIds = GenerateIds(customIds);
    else if (Array.isArray(customIds)) ResolvedIds = customIds;

    return (Interaction: MessageComponentInteraction) => {
        //console.log(Interaction.user.username, member.user.username, messageId, Interaction.message.id, ResolvedIds, Interaction.customId)
        const result = (() => {
            if (messageId != null && (messageId != Interaction.message.id)) return false;
            if (debug == true) console.log(`Filter Interaction Received:`.green, JSON.stringify({
                user: Interaction.user.username,
                customId: Interaction.customId,
                memberMatches: !(member != null && Interaction.user.id != member.user.id),
                customIdMatches: ResolvedIds.includes(Interaction.customId),
                matches: (member != null && Interaction.user.id != member.user.id) && ResolvedIds.includes(Interaction.customId),
                member: member.user.username,
                messageId,
                ResolvedIds
            }));
            if (member != null && Interaction.user.id != member.user.id) return false;
            return ResolvedIds.includes(Interaction.customId);
        })();

        if (result == false && (errorMessages == null || errorMessages == true)) {
            Interaction.reply({
                ephemeral: true,
                content: "This component is locked to the member who executed the command."
            });
        }

        return result;
    }
}

export class ButtonCollector {
    static AttachBackButton(collector: InteractionCollector<CollectedInteraction<CacheType>>) {
        collector.on("collect", async button => {
            if (button.customId == ButtonId.ReturnButton) {
                collector.stop("Returned to main menu");
            }
        });
    }

    static BackButton: string = ButtonId.ReturnButton;
}

export function GenerateIds(Selected: object) {
    return Object.values(Selected);
}