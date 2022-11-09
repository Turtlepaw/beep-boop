import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, EmbedBuilder, Events, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { SendError } from "../error";
import { Verifiers } from "../verify";
import { SendAppealMessage } from "../appeals";
import { Embed, Emojis } from "../configuration";
import Button from "../lib/ButtonBuilder";
import { DiscordButtonBuilder } from "../lib/DiscordButton";
import { Filter } from "../filter";

export default class TestAppeals extends Button {
    constructor() {
        super({
            CustomId: "SETUP_TICKETS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client) {
        const CurrentSettings = client.storage[`${interaction.guild.id}_tickets`];
        let Button: ButtonInteraction;
        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Continue")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("CONTINUE")
            )
        if (CurrentSettings != null) {
            const ActionMessage = await interaction.reply({
                content: "If you continue you'll overwrite your current settings, are you sure you want to continue?",
                components: [ActionButtons],
                fetchReply: true
            });

            Button = await ActionMessage.awaitMessageComponent({
                time: 0,
                filter: Filter(interaction.member, "CONTINUE"),
                componentType: ComponentType.Button
            });
        };

        const CustomIds = {
            ButtonModal: "CONFIGURE_BUTTON_MODAL"
        };

        const ButtonModal = new ModalBuilder()
            .setCustomId("BUTTON_CONFIG")
            .setTitle("Configuring Button")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("LABEL")
                            .setLabel("Button Label")
                            .setMaxLength(80)
                            .setMinLength(1)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("Create Ticket")
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("EMOJI")
                            .setLabel("Button Emoji")
                            .setMaxLength(10)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("🎟️")
                    )
            )
        const Modal = new ModalBuilder()
            .setCustomId("EMBED")
            .setTitle("Configuring Embed")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("EMBED_TITLE")
                            .setLabel("Title")
                            .setMaxLength(256)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("Tickets")
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("EMBED_DESCRIPTION")
                            .setLabel("Description")
                            .setMaxLength(4000)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder("Hello...")
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("EMBED_FOOTER")
                            .setLabel("Footer")
                            .setMaxLength(2048)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("Staff Team")
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("EMBED_COLOR")
                            .setLabel("Color")
                            .setMaxLength(7)
                            .setMinLength(3)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("#5865f2")
                            .setValue("#5865f2")
                    )
            )
        const Menu = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("CHANNEL_SELECT")
                    .addOptions(
                        interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildText).map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.TextChannel)
                        )
                    )
            )
        const ModeratorMenu = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("CATEGORY_SELECT")
                    .addOptions([
                        ...interaction.guild.channels.cache.filter(e => e.type == ChannelType.GuildCategory).map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.TextChannel)
                        ),
                        new SelectMenuOptionBuilder()
                            .setEmoji(Emojis.TextChannel)
                            .setValue("NEW")
                            .setLabel("Create one for me")
                    ])
            )
        const ModalButton = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("OPEN_EMBED_MODAL")
                    .setLabel("Setup Embed")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("📤")
            )

        const SetValuesButton = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("SET_VALUES")
                    .setLabel("Set Button Values")
                    .setStyle(ButtonStyle.Secondary)
            )

        const Message = await (Button == null ? interaction : Button).reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: "Step 1",
                        iconURL: "https://cdn.discordapp.com/emojis/1035661457922195488.png"
                    })
                    .setTitle(`${Emojis.MessagePin} Ticket Embed`)
                    .setDescription("Let's start off with what you would like the ticket embed to say, clicking below will open a modal where you'll be able to set the embed values.")
            ],
            components: [ModalButton],
            fetchReply: true
        });

        const ButtonInteraction = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0
        });

        await ButtonInteraction.showModal(Modal);

        const ModalInteraction = await ButtonInteraction.awaitModalSubmit({
            time: 0
        });

        let Settings = {
            Embed: null,
            TicketChannel: null,
            ModeratorChannel: null,
            ButtonStyle: null,
            ButtonLabel: null,
            ButtonEmoji: null
        }

        const Options = {
            Footer: ModalInteraction.fields.getTextInputValue("EMBED_FOOTER"),
            Title: ModalInteraction.fields.getTextInputValue("EMBED_TITLE"),
            Description: ModalInteraction.fields.getTextInputValue("EMBED_DESCRIPTION"),
            Color: ModalInteraction.fields.getTextInputValue("EMBED_COLOR"),
        }

        if (!Verifiers.isHexColor(Options.Color))
            return SendError(interaction, "Color must be a hex color (e.g. `#5865f2`");

        const ModalEmbed = new EmbedBuilder()

        if (Options.Color) ModalEmbed.setColor(Options.Color)
        if (Options.Description) ModalEmbed.setDescription(Options.Description)
        if (Options.Title) ModalEmbed.setTitle(Options.Title)
        if (Options.Footer) ModalEmbed.setFooter({
            text: Options.Footer
        });

        Settings.Embed = ModalEmbed;

        const MenuMessage = await ModalInteraction.reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: "Step 2",
                        iconURL: "https://cdn.discordapp.com/emojis/1035661457922195488.png"
                    })
                    .setTitle(`${Emojis.TextChannel} Ticket Channel`)
                    .setDescription("Now, select a ticket channel, this will be where the embed gets sent to.")
            ],
            components: [Menu],
            fetchReply: true
        });

        const MenuInteraction = await MenuMessage.awaitMessageComponent({
            componentType: ComponentType.SelectMenu,
            time: 0
        });

        Settings.TicketChannel = MenuInteraction.values[0];

        const ModeratorMessage = await MenuInteraction.reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: "Step 3",
                        iconURL: "https://cdn.discordapp.com/emojis/1035661457922195488.png"
                    })
                    .setTitle(`${Emojis.TextChannel} Ticket Category`)
                    .setDescription("Select the ticket category, this will be where moderators can see tickets.")
            ],
            components: [ModeratorMenu],
            fetchReply: true
        });

        const ModeratorInteraction = await ModeratorMessage.awaitMessageComponent({
            componentType: ComponentType.SelectMenu,
            time: 0
        });

        const Channels = await interaction.guild.channels.fetch();
        const Value = ModeratorInteraction.values[0];
        Settings.ModeratorChannel = Value;
        let Category = Channels.get(Settings.ModeratorChannel);
        if (Value == "NEW")
            Category = await interaction.guild.channels.create({
                type: ChannelType.GuildCategory,
                name: "Tickets"
            })

        Settings.ModeratorChannel = Category.id;

        if (Category.type != ChannelType.GuildCategory)
            return SendError(ModeratorInteraction, "Channel must be a text category");

        const Channel = await Category.children.create({
            type: ChannelType.GuildText,
            name: "logs"
        });

        const EmbedChannel = Channels.get(Settings.TicketChannel);

        if (EmbedChannel.type != ChannelType.GuildText)
            return SendError(ModeratorInteraction, "Ticket embed channel must be a text channel");

        Channel.send({
            content: "This category has been set up to recieve tickets."
        });

        const SetButtonMessage = await ModeratorInteraction.reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: "Step 4",
                        iconURL: "https://cdn.discordapp.com/emojis/1035661457922195488.png"
                    })
                    .setTitle(`👆 You're almost done!`)
                    .setDescription("One last step, set up the button that users will click to open a ticket.")
            ],
            components: [SetValuesButton],
            fetchReply: true
        });

        const SetButtonValuesInteraction = await SetButtonMessage.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0
        });

        SetButtonValuesInteraction.showModal(ButtonModal);

        const ButtonModalInteraction = await SetButtonValuesInteraction.awaitModalSubmit({
            time: 0
        });

        const ButtonOptions = {
            Label: ButtonModalInteraction.fields.getTextInputValue("LABEL"),
            Emoji: ButtonModalInteraction.fields.getTextInputValue("EMOJI")
        }

        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new DiscordButtonBuilder()
                    .setLabel(ButtonOptions.Label)
                    .safelySetEmoji(ButtonOptions.Emoji)
                    .setCustomId("Primary")
                    .setStyle(ButtonStyle.Primary),
                new DiscordButtonBuilder()
                    .setLabel(ButtonOptions.Label)
                    .safelySetEmoji(ButtonOptions.Emoji)
                    .setCustomId("Secondary")
                    .setStyle(ButtonStyle.Secondary),
                new DiscordButtonBuilder()
                    .setLabel(ButtonOptions.Label)
                    .safelySetEmoji(ButtonOptions.Emoji)
                    .setCustomId("Success")
                    .setStyle(ButtonStyle.Success),
                new DiscordButtonBuilder()
                    .setLabel(ButtonOptions.Label)
                    .safelySetEmoji(ButtonOptions.Emoji)
                    .setCustomId("Danger")
                    .setStyle(ButtonStyle.Danger)
            );

        const ButtonStyleMessage = await ButtonModalInteraction.reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: "Step 4",
                        iconURL: "https://cdn.discordapp.com/emojis/1035661457922195488.png"
                    })
                    .setTitle(`👆 You're almost done!`)
                    .setDescription("One last step, select the button style.")
            ],
            components: [Buttons],
            fetchReply: true
        });

        const Interaction = await ButtonStyleMessage.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0
        });

        Settings.ButtonStyle = ButtonStyle[Interaction.customId];

        EmbedChannel.send({
            embeds: [
                Settings.Embed
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new DiscordButtonBuilder()
                            .setLabel(ButtonOptions.Label)
                            .safelySetEmoji(ButtonOptions.Emoji)
                            .setCustomId("OPEN_TICKET")
                            .setStyle(Settings.ButtonStyle)
                    )
            ]
        });

        await Interaction.reply({
            embeds: [
                new Embed()
                    .setTitle(`${Emojis.Tada} You're all done!`)
                    .setDescription("Tickets are set up on this server, users that want to contact you can now privately contact you through tickets.")
                    .addFields([{
                        name: "Settings",
                        value: `1. Set the ticket embed\n2. Set the ticket channel to <#${Settings.TicketChannel}>\n3. Set the ticket category to <#${Settings.ModeratorChannel}>\n4. Set the button label to ${ButtonOptions.Label} ${ButtonOptions.Emoji != null ? `and the button emoji to ${ButtonOptions.Emoji}` : ""}\n5. Set the button style to ${Settings.ButtonStyle}`
                    }])
            ]
        });

        client.storage[`${interaction.guild.id}_tickets`] = Settings.ModeratorChannel;
    }
}