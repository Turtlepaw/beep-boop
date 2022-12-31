import { ActionRow, ActionRowBuilder, ActivityType, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, ChannelType, Client, ComponentType, EmbedBuilder, Events, GuildMember, GuildMemberRoleManager, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, InteractionReplyOptions, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputComponent, TextInputStyle, time, TimestampStyles, } from "discord.js";
import { FriendlyInteractionError, SendError } from "../utils/error";
import { Verifiers } from "../utils/verify";
import { SendAppealMessage } from "../utils/appeals";
import { Colors, Embed, GenerateTranscriptionURL, Icons } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { Filter } from "../utils/filter";
import { VerificationLevel } from "../models/Configuration";
import { generateId, generatePassword } from "../utils/Id";
import { create } from "svg-captcha";
import ConvertSVG from "svg2img";
import { Canvas } from "canvas";
import { Captcha } from "captcha-canvas";
import { isSuspicious as isMemberSuspicious } from "../utils/verifyMember";
import { randomBytes } from "crypto";
import { Endorse } from "../utils/Profile";

export function randomText(characters: number): string {
    return randomBytes(characters).toString('hex').toUpperCase().substr(0, characters);
}

function shuffle<T = any>(array: T[]): T[] {
    let currentIndex = array.length;
    let randomIndex: number;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function GenerateCaptcha(text: string, style: ButtonStyle = ButtonStyle.Secondary) {
    const GenerateString = () => randomText(6);
    const SelectedId = text;
    const Ids = shuffle([
        SelectedId,
        GenerateString(),
        GenerateString(),
        GenerateString(),
        GenerateString()
    ]);

    return {
        toActionRow: () => new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                Ids.map(e =>
                    new ButtonBuilder()
                        .setLabel(e)
                        .setCustomId(e)
                        .setStyle(style)
                )
            ),
        SelectedId
    }
}

const GiveEndorsements = false;
async function CaptchaVerification(interaction: ButtonInteraction, isCustom = false) {
    const Description = `${isCustom ?
        "We've detected suspicious activity from you, to continue in this server verify yourself by clicking a button below that matches the image."
        : "This server has set their verification to high, to continue in this server verify yourself by clicking a button below that matches the image."
        }`;
    const ImageCaptcha = new Captcha()
        .addDecoy({ opacity: 1 })
        .drawTrace({ color: Colors.BrandColor })
        .drawCaptcha({ color: Colors.BrandColor });
    const captcha = GenerateCaptcha(ImageCaptcha.text);

    const Attachment = new AttachmentBuilder(await ImageCaptcha.png, {
        name: "captcha.png"
    });

    const Message = await interaction.reply({
        ephemeral: true,
        fetchReply: true,
        embeds: [
            await new Embed(interaction.guild)
                .setTitle("Verification")
                .setDescription(Description)
                .setImage("attachment://captcha.png")
                .Resolve()
        ],
        components: [
            captcha.toActionRow()
        ],
        files: [Attachment]
    });

    const Button = await Message.awaitMessageComponent({
        time: 0
    });

    const isCorrect = () => Button.customId == captcha.SelectedId;
    if (isCorrect() && GiveEndorsements) Endorse(interaction.member.user.id, interaction.client);
    return {
        isCorrect,
        Button
    };
}

export default class Verification extends Button {
    constructor() {
        super({
            CustomId: "VERIFY_USER",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);
        if (Configuration.Verification.Roles == null || Configuration.Verification.Roles == null) {
            FriendlyInteractionError(interaction, "This server hasn't been properly set up yet, contact server admins about this.");
            return;
        }
        const Roles = await Promise.all(Configuration.Verification.Roles.map(async e => interaction.guild.roles.fetch(e)));

        let MemberRoles = interaction.member.roles as GuildMemberRoleManager;
        if (Array.isArray(MemberRoles)) {
            MemberRoles = (await interaction.guild.members.fetch(interaction.user.id)).roles;
        };

        if (Configuration.Verification.Roles.map(e => MemberRoles.cache.has(e)).includes(true)) {
            FriendlyInteractionError(interaction, "You're already verified.");
            return;
        }

        async function AssignRoles() {
            Roles.forEach(Role => MemberRoles.add(Role));
        };

        const Verified: any = {
            ephemeral: true,
            components: [],
            files: [],
            embeds: [],
            content: `${Icons.Unlock} You've completed the captcha, you can now continue in this server${GiveEndorsements ? ", and since you've completed the captcha, we've given you an endorsement" : ""}.`
        };

        const Failed: any = {
            ephemeral: true,
            components: [],
            embeds: [],
            files: [],
            content: `${Icons.Lock} You've failed the verification.`
        }

        if (Configuration.Verification.Level == VerificationLevel.Low) {
            AssignRoles();
            await interaction.reply(Verified);
        } else if (Configuration.Verification.Level == VerificationLevel.Medium) {
            const isSuspicious = await isMemberSuspicious(interaction.member as GuildMember);
            if (isSuspicious) {
                const CaptchaResult = await CaptchaVerification(interaction, true);

                if (CaptchaResult.isCorrect()) {
                    AssignRoles();
                    await CaptchaResult.Button.update(Verified);
                } else {
                    await CaptchaResult.Button.update(Failed);
                }
            } else {
                AssignRoles();
                await interaction.reply(Verified);
            }
        } else if (Configuration.Verification.Level == VerificationLevel.High) {
            const CaptchaResult = await CaptchaVerification(interaction, false);

            if (CaptchaResult.isCorrect()) {
                AssignRoles();
                await CaptchaResult.Button.update(Verified);
            } else {
                await CaptchaResult.Button.update(Failed);
            }
        }
    }
}