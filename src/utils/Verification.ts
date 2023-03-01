import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { ResolveUser } from "./Profile";
import { UNTRUSTED_REPUTATION } from "@constants";
import { Icons } from "@config";

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys];

export interface VerificationOptions {
    interaction: ChatInputCommandInteraction | ButtonInteraction;
    member: GuildMember;
}

export async function Verification({ interaction, member }: RequireAtLeastOne<VerificationOptions, "interaction" | "member">) {
    const Reputation = await ResolveUser(interaction.user.id, interaction.client);
    if (Reputation.reputation == UNTRUSTED_REPUTATION) return interaction.reply({
        content: `${Icons.Shield} You must have a reputation atleast 0 to verify.`,
        ephemeral: true
    });
    const payload = {
        content: "Start your adventure in this server by verifying that you're human.",
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Start Verification")
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId("VERIFY")
                )
        ],
        ephemeral: true
    };

    if (interaction == null) member.send(payload);
    else interaction.reply(payload);
}