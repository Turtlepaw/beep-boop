import { ButtonInteraction, Client, Events } from "discord.js";
import { Icons } from "../configuration";
import Event from "../lib/Event";
import { Logger } from "../logger";
import { FriendlyInteractionError } from "../utils/error";

export default class ButtonRole extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, interaction: ButtonInteraction) {
        try {
            const Variant: "Members" | "Circles" = "Members";
            const Variants = {
                Members: {
                    Add: Icons.MemberAdd,
                    Remove: Icons.RoleRemove
                },
                Circles: {
                    Add: Icons.Add,
                    Remove: Icons.Remove
                }
            };

            if (!interaction.isButton()) return;
            if (!interaction.inCachedGuild()) return;
            if (!interaction.customId.startsWith("button-role:")) return;
            const RoleId = interaction.customId.replace("button-role:", "");
            const Role = await interaction.guild.roles.fetch(RoleId);

            if (!interaction.member.roles.cache.has(RoleId)) {
                interaction.member.roles.add(Role);
                await interaction.reply({
                    ephemeral: true,
                    content: `${Variants[Variant].Add} Successfully assigned you ${Role}.`
                })
            } else {
                interaction.member.roles.remove(Role);
                await interaction.reply({
                    ephemeral: true,
                    content: `${Variants[Variant].Remove} Successfully removed ${Role}.`
                });
            }
        } catch (e) {
            Logger.error(`Error when assigning ${interaction.user.tag} a role: ${e}`);
            await FriendlyInteractionError(interaction, "Something went wrong assigning you a role... Let's try that again.")
        }
    }
}