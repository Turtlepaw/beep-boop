import { ActionRowBuilder, ButtonBuilder, codeBlock } from "@discordjs/builders";
import { ButtonStyle, ComponentType, Guild, Interaction, RepliableInteraction, inlineCode } from "discord.js";
import { DEVELOPER_BUILD } from "../index";
import { Embed, Icons, SupportServerInvite } from "../configuration";
import { InteractionReplyManager } from "./classes";
import { Logger } from "../logger";

export interface ErrorMessage {
    GuildId: string;
    Summary: string;
    Effects: string;
}

export interface ErrorStorage {
    [key: string]: ErrorMessage[];
}

export class ErrorManager {
    AddError(Summary: string, Effects: string, Guild: Guild) {
        const Key = this.GenerateKey(Guild.id);
        const Items = Guild.client.storage[Key];

        Guild.client.storage[Key] = [{
            GuildId: Guild.id,
            Summary,
            Effects
        },
        ...(Items == null ? [] : Items)
        ];
    }

    AllErrors(Guild: Guild): ErrorMessage[] {
        const Key = this.GenerateKey(Guild.id);
        return Guild.client.storage[Key];
    }

    private GenerateKey(Id: string) {
        return `${Id}_errors`
    }
}

export async function SendError(interaction: Interaction, errorMessage: string) {
    console.warn("The SendError function is deprecated, use InteractionError instead")
    if (interaction.isRepliable()) {
        const CustomId = {
            LearnMore: "REDIRECT_SUPPORT_SERVER",
            DeveloperOptions: "DEVELOPER_OPTIONS"
        }
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(CustomId.LearnMore)
                    .setLabel("Learn More")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel("Error Information")
                    .setCustomId(CustomId.DeveloperOptions)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false)
            );

        const payload = DEVELOPER_BUILD ? {
            content: codeBlock("js", errorMessage)
        } : {
            content: "Something didn't quite go right.",
            components: [Buttons],
            fetchReply: true
        }

        if (interaction.replied || interaction.deferred) {
            await interaction.editReply(payload);
        } else {
            await interaction.reply(payload);
        }

        const Message = await interaction.fetchReply();

        await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: (i) => i.customId == CustomId.DeveloperOptions,
            time: 0,
        }).then(async (ButtonInteraction) => {
            await ButtonInteraction.reply({
                content: `Here's what we know:\n\n\`\`\`${errorMessage}\`\`\``
            });
        }).catch(console.log);
    }
}

export async function FriendlyInteractionError(interaction: Interaction, errorMessage: string, ephemeral = true) {
    if (interaction.isRepliable()) {
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({
                content: `${Icons.Error} ` + errorMessage,
            });
        } else {
            await interaction.reply({
                content: `${Icons.Error} ` + errorMessage,
                ephemeral
            });
        }
    }
}


export interface InteractionErrorOptions {
    interaction: RepliableInteraction;
    message?: string;
    icon?: Icons;
    ephemeral?: boolean;
    error?: string;
    createError?: boolean;
}

const DefaultInteractionErrorOptions: Partial<InteractionErrorOptions> = {
    icon: Icons.Error,
    message: "Something went wrong... Try again in a few minutes.",
    ephemeral: true,
    error: "Unknown Error: not provided",
    createError: true
}

export async function InteractionError(options: InteractionErrorOptions) {
    const { icon, interaction, message, ephemeral, error, createError } = Object.assign(DefaultInteractionErrorOptions, options);
    const Interaction = new InteractionReplyManager(interaction);
    const ErrorDB = createError ? (await interaction.client.Storage.Errors.Create({
        CreatedBy: interaction.user.id,
        CreatedAt: new Date(),
        Stack: `${error}`,
        Title: `${error.length >= 25 ? (error.slice(0, 25) + "...") : error}`
    })) : null;
    //@ts-expect-error this exists
    if (createError) Logger.error(`${options.error} (${ErrorDB.Error})`)

    console.log(ErrorDB)
    await Interaction.send({
        content: `${icon} ${message}`,
        embeds: createError ? [
            await new Embed(interaction.guild)
                //@ts-expect-error this exists
                .setDescription(`Show this ID when reporting this bug: ${inlineCode(ErrorDB.Error)}`)
                .Resolve()
        ] : [],
        ephemeral,
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Support Server")
                        .setStyle(ButtonStyle.Link)
                        .setURL(SupportServerInvite)
                )
        ]
    });
}