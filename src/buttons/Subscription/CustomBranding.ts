import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, ComponentType, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { FriendlyInteractionError } from "../../utils/error";
import { Verifiers } from "../../utils/verify";
import { Embed, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";
import { Filter } from "../../utils/filter";
import { ChannelSelectMenu, StringSelector, StringSelectBuilder } from "../../utils/components";
import { customClients, StartCustomBot } from "../../utils/customBot";
import { ResolveUser } from "../../utils/Profile";
import { Subscriptions } from "../../models/Profile";
import { PremiumPerks } from "../../utils/constants";

export const CustomBrandingModal = "CUSTOM_BRANDING_MODAL";
export default class CustomBranding extends Button {
    constructor() {
        super({
            CustomId: "CUSTOM_BRANDING",
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: []
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const Profile = await ResolveUser(interaction.user.id, client);
        if (Profile.subscription == Subscriptions.None) return FriendlyInteractionError(interaction, "You don't have an active subscription on your account.")
        let CurrentBot = await client.Storage.CustomBots.Get({
            Owner: interaction.user.id
        });
        const CustomBots = await client.Storage.CustomBots.FindBy({
            Owner: interaction.user.id
        });
        const ResolvedBots = await Promise.all(CustomBots.map(e => interaction.client.users.fetch(e.BotId)));

        if (CurrentBot != null) {
            let BotUser = await interaction.client.users.fetch(CurrentBot.BotId);
            const CurrentChannel = CurrentBot.LoggingChannel != null ? `<#${CurrentBot.LoggingChannel}>` : "None";
            enum Id {
                ChannelSelector = "LOG_CHANNEL_SELECTOR",
                ResetBot = "RESET_BOT_DANGER",
                EditStatus = "EDIT_CUSTOM_STATUS",
                EditStatusModal = "EDIT_CUSTOM_STATUS_MODAL",
                RestartBot = "RESTART_CUSTOM_BOT",
                NewBot = "NEW_BOT",
                BotSelector = "BOT_SELECTOR"
            }

            const Components = ChannelSelectMenu(Id.ChannelSelector, interaction.guild.channels.cache, (component) =>
                component.setPlaceholder("Logging Channel")
            );

            const BotSelector = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(Id.BotSelector)
                        .setOptions(
                            CustomBots.map(e => {
                                const Bot = ResolvedBots.find(bot => bot.id == e.BotId);
                                return new StringSelectMenuOptionBuilder()
                                    .setLabel(Bot.username)
                                    .setValue(Bot.id);
                            })
                        )
                        .setPlaceholder("Select a bot")
                );

            const GenerateEmbed = () => new Embed(interaction.guild)
                .setTitle("Configuring your Custom Bot")
                .addFields([{
                    name: "Custom Bot Name",
                    value: BotUser.username || "Unknown."
                }, {
                    name: "Configuration",
                    value: `• Logging Channel: ${CurrentChannel}`
                }]);
            const isAllowedMore = CustomBots.length != PremiumPerks[Profile.subscription].CustomBots;
            const GenerateComponents = () => new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/developers/applications/${CurrentBot.BotId}`)
                        .setLabel("Configure Bot"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Edit Status")
                        .setCustomId(Id.EditStatus),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("Restart Bot")
                        .setCustomId(Id.RestartBot),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Delete Bot")
                        .setCustomId(Id.ResetBot),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel(`New Bot${isAllowedMore ? "" : " (not included in your subscription)"}`)
                        .setCustomId(Id.NewBot)
                        .setDisabled(!isAllowedMore)
                );
            const Message = await interaction.reply({
                ephemeral: true,
                fetchReply: true,
                embeds: [
                    GenerateEmbed()
                ],
                components: [
                    BotSelector,
                    Components,
                    GenerateComponents()
                ]
            });

            const Collector = Message.createMessageComponentCollector({
                filter: Filter({
                    member: interaction.member,
                    customIds: Id
                }),
                time: 0
            });

            Collector.on("collect", async Interaction => {
                if (Interaction.isStringSelectMenu() && Interaction.customId == Id.BotSelector) {
                    const BotId = Interaction.values[0];
                    const ResolvedBot = ResolvedBots.find(e => e.id == BotId);
                    const Bot = CustomBots.find(e => e.BotId == BotId);
                    BotUser = ResolvedBot;
                    CurrentBot = Bot;
                    await Interaction.update({
                        embeds: [
                            GenerateEmbed()
                        ],
                        components: [
                            BotSelector,
                            Components,
                            GenerateComponents()
                        ]
                    })
                } else if (Interaction.isChannelSelectMenu() && Interaction.customId == Id.ChannelSelector) {
                    const SelectedChannel = Interaction.channels.first();

                    if (!Verifiers.GuildText(SelectedChannel)) return FriendlyInteractionError(Interaction, "Invalid channel.")

                    const Webhook = await SelectedChannel.createWebhook({
                        name: `${BotUser.username}`,
                        avatar: BotUser.avatarURL() || null,
                        reason: "Custom Bot logging webhook"
                    });

                    await Webhook.send({
                        content: `This channel has been set up to receive logs for ${interaction.user}'s custom bot. (${BotUser})`
                    });

                    await client.Storage.CustomBots.Edit({
                        CustomId: CurrentBot.CustomId
                    }, {
                        LoggingChannel: SelectedChannel.id,
                        WebhookURL: Webhook.url
                    });

                    await Interaction.reply({
                        ephemeral: true,
                        content: `${Icons.Discover} Saved your configuration.`
                    });
                } else if (Interaction.isButton() && Interaction.customId == Id.ResetBot) {
                    const ComponentMessage = await Interaction.reply({
                        content: `${Icons.Zap} This **will not delete your bot from Discord,** it will only remove your bot from Beep Boop, after you remove it, it will go offline.`,
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .setComponents(
                                    new ButtonBuilder()
                                        .setCustomId("DELETE_ANYWAY")
                                        .setLabel("Delete it!")
                                        .setStyle(ButtonStyle.Danger)
                                )
                        ],
                        ephemeral: true,
                        fetchReply: true
                    });

                    const DeleteComponent = await ComponentMessage.awaitMessageComponent({
                        time: 0
                    });

                    await client.Storage.CustomBots.Delete({
                        CustomId: CurrentBot.CustomId
                    });

                    DeleteComponent.update({
                        content: "Bot deleted, shutting down...",
                        components: []
                    });

                    (customClients[CurrentBot.BotId] as Client).destroy();
                } else if (Interaction.isButton() && Interaction.customId == Id.EditStatus) {
                    enum SelectFieldIds {
                        SelectMenu = "SELECT_STATUS_TYPE"
                    }
                    enum FieldId {
                        Text = "STATUS_TEXT",
                        Type = "STATUS_TYPE"
                    }
                    const FilteredOptions = Object.entries(ActivityType).filter(e => isNaN(Number(e[0]))).filter(e => e[1] != ActivityType.Custom && e[1] != ActivityType.Streaming);
                    const StatusTypeFields = new StringSelector()
                        .AddOptions(
                            ...FilteredOptions.map(([k, v]) =>
                                new StringSelectBuilder()
                                    .setLabel(`${k}${CurrentBot.CustomStatus == v ? " (current)" : ""}`)
                                    .setValue(k)
                                    .setDescription(`${v == ActivityType.Listening ? "Listening to" : (v == ActivityType.Competing ? "Competing in" : k)} something`)
                            )
                        )
                        .SetCustomId(SelectFieldIds.SelectMenu)
                        .Configure(e => e.setPlaceholder("Select a status type"))
                        .toActionRow();

                    const TypeMessage = await Interaction.reply({
                        content: `${Icons.Tag} Select an status type`,
                        components: [StatusTypeFields],
                        fetchReply: true,
                        ephemeral: true
                    });

                    const ModalButton = await TypeMessage.awaitMessageComponent({
                        componentType: ComponentType.StringSelect,
                        time: 0
                    })

                    const TextComponent = new TextInputBuilder()
                        .setLabel("Status Text")
                        .setCustomId(FieldId.Text)
                        .setMaxLength(128)
                        .setMinLength(1)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("discord.gg");
                    // const TypeComponent = new TextInputBuilder()
                    //     .setLabel("Status Type")
                    //     .setCustomId(FieldId.Type)
                    //     .setMaxLength(128)
                    //     .setMinLength(1)
                    //     .setRequired(true)
                    //     .setStyle(TextInputStyle.Short)
                    //     .setPlaceholder([ActivityType.Competing, ActivityType.Listening, ActivityType.Playing, ActivityType.Watching].map(e => ActivityType[e]).join(" | "));

                    if (Verifiers.String(CurrentBot.CustomStatus)) TextComponent.setValue(CurrentBot.CustomStatus);
                    //if (CurrentBot.CustomStatusType != null) TypeComponent.setValue(ActivityType[CurrentBot.CustomStatusType]);

                    await ModalButton.showModal(
                        new ModalBuilder()
                            .setTitle("Editing Custom Status")
                            .setCustomId(Id.EditStatusModal)
                            .setComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .setComponents(
                                        TextComponent,

                                    ),
                                // new ActionRowBuilder<TextInputBuilder>()
                                //     .setComponents(
                                //         TypeComponent
                                //     )
                            )
                    )

                    const ModalInteraction = await ModalButton.awaitModalSubmit({
                        time: 0
                    });

                    const Fields = {
                        Text: ModalInteraction.fields.getTextInputValue(FieldId.Text),
                        //Type: ModalInteraction.fields.getTextInputValue(FieldId.Type)
                    }

                    await client.Storage.CustomBots.Edit({
                        CustomId: CurrentBot.CustomId
                    }, {
                        CustomStatus: Fields.Text,
                        CustomStatusType: ActivityType[ModalButton.values[0]]
                    });

                    const hasBot = (customClients[CurrentBot.BotId] as Client) != null;

                    if (hasBot) (customClients[CurrentBot.BotId] as Client).user.setActivity({
                        type: ActivityType[ModalButton.values[0]],
                        name: Fields.Text
                    });

                    await ModalInteraction.reply({
                        ephemeral: true,
                        content: `${Icons.Discover} Saved your configuration${hasBot ? " and set status." : " but couldn't set bot's status, try restarting your bot."}`
                    });
                } else if (Interaction.isButton() && Interaction.customId == Id.RestartBot) {
                    await Interaction.reply({
                        ephemeral: true,
                        content: `${Icons.Discover} Shutting down your bot, it should come back online in a few minutes...`
                    });

                    await (customClients[CurrentBot.BotId] as Client).destroy();
                    StartCustomBot(CurrentBot.Token, client);
                } else if (Interaction.isButton() && Interaction.customId == Id.NewBot) {
                    const ModalMessage = await Interaction.reply({
                        ephemeral: true,
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Continue")
                                        .setStyle(ButtonStyle.Danger)
                                        .setCustomId("CONTINUE")
                                )
                        ],
                        fetchReply: true,
                        content: "Before you continue, make sure you've got your custom bot ready, if you don't know how to do that, check out the [guide](https://bop.trtle.xyz/learn/custom-bots)."
                    });

                    const ModalInteraction = await ModalMessage.awaitMessageComponent({
                        time: 0,
                        componentType: ComponentType.Button
                    });

                    await ModalInteraction.showModal(
                        new ModalBuilder()
                            .setTitle("Configuring Custom Branding")
                            .setCustomId(CustomBrandingModal)
                            .setComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId("TOKEN")
                                            .setLabel("Bot Token")
                                            .setRequired(true)
                                            .setStyle(TextInputStyle.Short)
                                            .setPlaceholder("NzkyNzE1NDU0MTk2MDg4ODQy.X-hvzA.Ovy4MCQywSkoMRRclStW4xAYK7I")
                                            .setMinLength(59)
                                            .setMaxLength(72)
                                    )
                            )
                    );
                }
            })
        } else {
            const Message = await interaction.reply({
                ephemeral: true,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Continue")
                                .setStyle(ButtonStyle.Danger)
                                .setCustomId("CONTINUE")
                        )
                ],
                fetchReply: true,
                content: "Before you continue, make sure you've got your custom bot ready, if you don't know how to do that, check out the [guide](https://bop.trtle.xyz/learn/custom-bots)."
            });

            const Interaction = await Message.awaitMessageComponent({
                time: 0,
                componentType: ComponentType.Button
            });

            await Interaction.showModal(
                new ModalBuilder()
                    .setTitle("Configuring Custom Branding")
                    .setCustomId(CustomBrandingModal)
                    .setComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId("TOKEN")
                                    .setLabel("Bot Token")
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("NzkyNzE1NDU0MTk2MDg4ODQy.X-hvzA.Ovy4MCQywSkoMRRclStW4xAYK7I")
                                    .setMinLength(59)
                                    .setMaxLength(72)
                            )
                    )
            );
        }
    }
}
