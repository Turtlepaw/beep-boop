/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Events as ClientEvents, GuildBasedChannel, InteractionReplyOptions, PermissionResolvable, RepliableInteraction, inlineCode } from "discord.js";
import klawSync from "klaw-sync";
import { BaseDirectory, Icons } from "../configuration";
import ButtonBuilder from "../lib/ButtonBuilder";
import EventBuilder from "../lib/Event";
import { InteractionError, SendError } from "./error";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { Logger } from "../logger";

const InputPermissionsMessage: InteractionReplyOptions = {
    content: `${Icons.Error} You don't have the required permissions to run this command.`,
    ephemeral: true
};

const ButtonPermissionsMessage: InteractionReplyOptions = {
    content: `${Icons.Error} You don't have the required permissions to use this button.`,
    ephemeral: true
};

const ButtonGuildMessage: InteractionReplyOptions = {
    content: `${Icons.Error} This button can only be used within a server.`,
    ephemeral: true
};

const InputGuildMessage: InteractionReplyOptions = {
    content: `${Icons.Error} This command can only be used within a server.`,
    ephemeral: true
};

async function CreateError(Summary: string, interaction: RepliableInteraction) {
    InteractionError({
        interaction,
        createError: true,
        ephemeral: true,
        error: Summary
    });

    // if (Logs?.Error == null) return;
    // if (DEVELOPER_BUILD == true) return;
    // const Guild = await client.guilds.fetch(guildId);
    // const Channel = await Guild.channels.fetch(Logs.Error);
    // const InviteChannel = ExecutingGuild.channels.cache.filter(e => e.type == ChannelType.GuildText).first();
    // const Invite = await (InviteChannel as TextChannel).createInvite({
    //     maxAge: 0,
    //     maxUses: 0,
    //     reason: "Something didn't go right, this might help developers locate the error."
    // }).catch(e => Logger.warn(`Failed Creating Invite: ${e}`)) || { url: "https://discord.com/no_invite" };

    // await (Channel as TextChannel).send({
    //     embeds: [
    //         new Embed(ExecutingGuild)
    //             .setTitle("Something didn't go right...")
    //             .setDescription(`Here's what happened:\n\n\`\`\`bash\n${Summary}\`\`\``)
    //     ],
    //     components: [
    //         CreateLinkButton(
    //             Invite.url,
    //             "Invite URL"
    //         )
    //     ]
    // });
}

async function StartEventService(client: Client) {
    try {
        //Find the event files
        const Files = klawSync(`${BaseDirectory}/events`, { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
        const Events: EventBuilder[] = [];
        for (const File of Files) {
            const OriginalFile = require(File.path);
            const Event: EventBuilder = new OriginalFile.default();
            Events.push(Event);
        }

        //Handle Event
        for (const Event of Events) {

            client.on(Event.EventName, (...args) => {
                try {
                    Event.ExecuteEvent(client, ...args)
                } catch (e) {
                    Logger.error(`Could not execute event: ${e}`)
                }
            });
        }
    } catch (e) {
        console.log("Error:".red, e);
        Logger.error(`Event Error:`, e);
    }
}

function isGuildBased(channel: unknown): channel is GuildBasedChannel {
    return channel?.["guild"] != null;
}

async function HandleBotPermissions(interaction: RepliableInteraction, permisisons: PermissionResolvable[]) {
    const Channel = interaction.channel;
    if (!isGuildBased(Channel)) return true;
    if (permisisons == null || permisisons.length == 0) return true;
    if (interaction.channel.permissionsFor(interaction.guild.members.me).any(permisisons)) {
        return true;
    } else {
        const Missing = interaction.channel.permissionsFor(interaction.guild.members.me).missing(permisisons);
        await InteractionError({
            createError: false,
            interaction,
            message: `The bot doesn't have the correct permissions to run this command. Missing: ${Missing.map(e => inlineCode(e)).join(" ")}`
        });
        return false;
    }
}

async function StartButtonService(client: Client) {
    try {
        //Find the button files
        const Files = klawSync(`${BaseDirectory}/buttons`, { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
        const Buttons: ButtonBuilder[] = [];
        for (const File of Files) {
            const OriginalFile = require(File.path);
            const Button: ButtonBuilder = new OriginalFile.default();
            if (Button.CustomId.endsWith("{any}")) {
                //appealbtn_deny -> startswith_appealbtn
                Button.CustomId = "startwith_" + Button.CustomId.replace("_{any}", "");
            }
            Buttons.push(Button);
        }

        //Handle button interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isButton()) {
                let Id = interaction.customId;
                let CustomId = "";
                const Button = Buttons.find(e => {
                    if (e.RequireIdFetching) {
                        //Set Id to the custom id
                        const FullId = e.CustomId.replace("startwith_", "");
                        Id = interaction.customId.replace((e.CustomId.replace("startwith_", "")), "").replace("_", "")
                        //Check if it starts with the Id
                        if (interaction.customId.startsWith(FullId)) {
                            CustomId = interaction.customId;
                            return true;
                        }
                    } else {
                        if (e.CustomId == interaction.customId) {
                            CustomId = interaction.customId
                            return true;
                        } else return false;
                    }
                });

                if (Button == null) return;
                if (interaction.guild == null && Button.GuildOnly) {
                    interaction.reply(ButtonGuildMessage);
                    return;
                }

                if (interaction.guild != null) {
                    if (Button.SomePermissions.length >= 1 && !interaction.memberPermissions.any(Button.SomePermissions)) {
                        interaction.reply(ButtonPermissionsMessage);
                        return;
                    }
                    if (Button.RequiredPermissions.length >= 1 && !interaction.memberPermissions.has(Button.RequiredPermissions)) {
                        interaction.reply(ButtonPermissionsMessage);
                        return;
                    }
                }

                if (CustomId != interaction.customId) return;
                if (await HandleBotPermissions(interaction, Button.ClientPermissions) == false) return;

                try {
                    await Button.ExecuteInteraction(interaction, client, Id);
                } catch (e) {
                    // Send it to the developers
                    CreateError(e, interaction);

                    // Log error
                    console.log(`Error:`.red, e);

                    // Log it in the logger
                    Logger.error(`Error executing ${interaction.customId}:`, e);

                    // Send error message
                    SendError(
                        interaction,
                        e
                    );
                }
            }
        });
    } catch (e) {
        console.log("Error:".red, e);
    }
}

async function StartSelectMenuService(client: Client) {
    try {
        //Find the button files
        const Files = klawSync(`${BaseDirectory}/select_menus`, { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') });
        const SelectOptions: SelectOptionBuilder[] = [];
        for (const File of Files) {
            const OriginalFile = require(File.path);
            const SelectOption: SelectOptionBuilder = new OriginalFile.default();
            SelectOptions.push(SelectOption);
        }

        //Handle button interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isAnySelectMenu()) {
                const Values = interaction.values;
                const SelectOption = SelectOptions.find(e => Values.includes(e.Value));

                if (SelectOption == null) return;
                if (interaction.guild == null && SelectOption.GuildOnly) {
                    interaction.reply(ButtonGuildMessage);
                    return;
                }

                if (interaction.guild != null) {
                    if (SelectOption.SomePermissions.length >= 1 && !interaction.memberPermissions.any(SelectOption.SomePermissions)) {
                        interaction.reply(ButtonPermissionsMessage);
                        return;
                    }
                    if (SelectOption.RequiredPermissions.length >= 1 && !interaction.memberPermissions.has(SelectOption.RequiredPermissions)) {
                        interaction.reply(ButtonPermissionsMessage);
                        return;
                    }
                }

                if (!Values.includes(SelectOption.Value)) return;
                if (await HandleBotPermissions(interaction, SelectOption.ClientPermissions) == false) return;

                try {
                    await SelectOption.ExecuteInteraction(interaction, client, Values);
                } catch (e) {
                    // Send it to the developers
                    CreateError(e, interaction);

                    // Log error
                    console.log(`Error:`.red, e);

                    // Log it in the logger
                    Logger.error(`Error executing ${interaction.values[0]}:`, e);

                    // Send error message
                    SendError(
                        interaction,
                        e
                    );
                }
            }
        });
    } catch (e) {
        console.log("Error:".red, e);
    }
}

async function StartContextMenuService(client: Client) {
    try {
        const ContextMenus = Array.from(client.ContextMenus).map(e => e[1]);

        //Handle button interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isContextMenuCommand()) {
                const ContextMenu = ContextMenus.find(e => e.Name == interaction.commandName);

                if (interaction.guild == null && ContextMenu.GuildOnly) {
                    interaction.reply(InputGuildMessage);
                    return;
                }

                if (interaction.guild != null) {
                    if (ContextMenu.SomePermissions.length >= 1 && !interaction.memberPermissions.any(ContextMenu.SomePermissions)) {
                        interaction.reply(InputPermissionsMessage);
                        return;
                    }
                    if (ContextMenu.RequiredPermissions.length >= 1 && !interaction.memberPermissions.has(ContextMenu.RequiredPermissions)) {
                        interaction.reply(InputPermissionsMessage);
                        return;
                    }
                }

                if (await HandleBotPermissions(interaction, ContextMenu.ClientPermissions) == false) return;
                try {
                    await ContextMenu.ExecuteContextMenu(interaction, client);
                } catch (e) {
                    // Send it to the developers
                    CreateError(e, interaction);

                    // Log error
                    console.log(`Error:`.red, e);

                    // Log it in the logger
                    Logger.error(`Error executing ${interaction.commandName}:`, e);

                    // Send error message
                    SendError(
                        interaction,
                        e
                    );
                }
            }
        });
    } catch (e) {
        console.log("Error:".red, e);
    }
}

export async function StartAutocompleteService(client: Client) {
    try {
        //Handle autocomplete interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isAutocomplete()) {
                const command = client.commands.get(interaction.commandName);

                try {
                    await command?.ExecuteAutocompleteRequest(interaction, client);
                } catch (e) {
                    console.log(`Error`.red, e);
                    // Log it in the logger
                    Logger.error(`Error executing ${interaction.commandName}'s autocomplete:`, e);
                }
            }
        })
    } catch (e) {
        console.log("Error:".red, e);
    }
}

export async function StartService(client: Client) {
    try {
        //Handle command interactions
        client.on(ClientEvents.InteractionCreate, async (interaction) => {
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);

                if (interaction.guild == null && command.GuildOnly) {
                    interaction.reply(InputGuildMessage);
                    return;
                }

                if (interaction.guild != null) {
                    if (command.SomePermissions.length >= 1 && !interaction.memberPermissions.any(command.SomePermissions)) {
                        interaction.reply(InputPermissionsMessage);
                        return;
                    }
                    if (command.RequiredPermissions.length >= 1 && !interaction.memberPermissions.has(command.RequiredPermissions)) {
                        interaction.reply(InputPermissionsMessage);
                        return;
                    }
                }

                if (await HandleBotPermissions(interaction, command.ClientPermissions) == false) return;

                try {
                    await command?.ExecuteCommand(interaction, client);
                } catch (e) {
                    // Send it to the developers
                    CreateError(e, interaction);

                    // Log error
                    console.log(`Error:`.red, e);

                    // Log it in the logger
                    Logger.error(`Error executing ${interaction.commandName}:`, e);

                    // Send error message
                    SendError(
                        interaction,
                        e
                    );
                }
            }
        })
    } catch (e) {
        console.log("Error:".red, e);
    }

    //Start other services
    StartSelectMenuService(client);
    StartButtonService(client);
    StartEventService(client);
    StartAutocompleteService(client);
    StartContextMenuService(client);
}