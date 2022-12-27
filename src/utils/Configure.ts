import { Emojis, Icons, Messages, Permissions, Embed } from "../configuration";
import { ModuleInformation, Modules } from "../commands/Server";
import SelectOptionBuilder from "../lib/SelectMenuBuilder";
import { ActionRowBuilder, AnyComponentBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Interaction, Message, ModalBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, TextChannel, TextInputBuilder, channelMention } from "discord.js";
import { ButtonCollector, Filter, GenerateIds } from "./filter";
import { CleanupChannel, ResolvedGuildConfiguration } from "./storage";
import { generateId } from "./Id";
import { CleanupType, GuildConfiguration } from "../models/Configuration";
import { ChannelSelector as ChannelSelectBuilder, GetTextInput } from "./components";
import { BackComponent, ButtonBoolean, TextBoolean } from "./config";
import ms from "ms";

export enum ConfigurationButtonType {
    Boolean = "boolean",
    String = "boolean_and_string"
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type SaveFunction = (CurrentConfiguration: GuildConfiguration, config: ResolvedGuildConfiguration) => any;

export interface GenerateEmbedResult {
    Item: keyof GuildConfiguration;
    Name: string;
    Type: ConfigurationButtonType;
    Children: Omit<GenerateEmbedResult, "Children">[];
}

export type GenerateEmbed = (configuration: GuildConfiguration, conf: ResolvedGuildConfiguration) => GenerateEmbedResult[];

export interface ModalInput {
    Builder: TextInputBuilder;
    GetValue: (configuration: ResolvedGuildConfiguration) => string;
    Item: keyof GuildConfiguration;
};

export interface ConfigurationButton {
    Label: string;
    //CustomId: string;
    Type: ConfigurationButtonType;
    Item: keyof GuildConfiguration;
    DefaultStyle?: ButtonStyle;
    ModalInputs?: ModalInput[];
    ResolveModalInput?: (value: string, id: string) => string;
}

export interface ConfigurationBuilderOptions {
    Module: Modules;
    Buttons: ConfigurationButton[];
    Save: SaveFunction;
    GenerateEmbed: GenerateEmbed;
}

export class ConfigurationBuilder {
    public Module: Modules;
    public Buttons: ConfigurationButton[];
    public Save: SaveFunction;
    public CurrentConfiguration: GuildConfiguration;
    public EmbedGenerator: GenerateEmbed;

    constructor(options: ConfigurationBuilderOptions) {
        this.Module = options.Module;
        this.Buttons = options.Buttons;
        this.Save = options.Save;
        this.EmbedGenerator = options.GenerateEmbed;
    }

    private EmbedChildren<T>(array: T[], item: (item: T) => string, noneMessage: string = "None") {
        const GetEmoji = (last: boolean = false) => last ? `${Icons.StemEnd}` : `${Icons.StemItem}`;
        let StringArray = "";
        let at = 0;
        array.forEach(e => {
            at++
            StringArray += `${GetEmoji(at == array.length)} ${item(e)}${at == array.length ? "" : "\n"}`;
        });
        if (array.length <= 0) StringArray = `${Icons.StemEnd} ${noneMessage}`;
        return StringArray;
    };

    private ResolveEnumValue(selectedEnum: object, selectedValue: string) {
        for (const [k, v] of Object.entries(selectedEnum)) {
            if (k == selectedValue || v == selectedValue) return selectedEnum[k];
        }
    };

    private GetButton(button: ButtonInteraction) {
        return this.Buttons.find(e => e.Item == button.customId);
    }

    private async StringButton(button: ButtonInteraction, configuration: ResolvedGuildConfiguration) {
        const ModalId = `string_modal_${generateId(3)}`;
        const Button = this.GetButton(button);
        if (Button.ModalInputs == null) throw new Error("ModalInputs cannot be null when having the button type set to String");
        const Fields = [
            ...Button.ModalInputs.map(e => {
                const value = e.GetValue(configuration);
                const builder = e.Builder;
                if (value != null) builder.setValue(value);
                return builder;
            })
        ]

        await button.showModal(
            new ModalBuilder()
                .setTitle("Text Selector")
                .setCustomId(ModalId)
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            Fields
                        )
                )
        );

        const ModalInteraction = await button.awaitModalSubmit({
            time: 0
        });

        const ModalValues = Button.ModalInputs.map(e => {
            const ModalInput = Fields.find(input => input.toJSON().custom_id == e.Item);
            return {
                value: GetTextInput(ModalInput.toJSON().custom_id, ModalInteraction),
                id: ModalInput.toJSON().custom_id,
                item: e.Item
            }
        });
        const ResolvedValues = ModalValues.map(e => {
            if (Button.ResolveModalInput == null) return {
                value: e.value,
                object: e
            }; else return {
                value: Button.ResolveModalInput(e.value, e.id),
                object: e
            }
        });

        await Promise.all(ResolvedValues.map(async e => {
            const Value = this.CurrentConfiguration[e.object.item];
            if (typeof Value == "boolean") {
                (this.CurrentConfiguration[e.object.item] as boolean) = Boolean(e.value);
            } else if (typeof Value == "string") {
                (this.CurrentConfiguration[e.object.item] as string) = e.value;
            }
        }));

        //await this.SaveConf(button.message);
        await ModalInteraction.reply(Messages.Saved);
    }

    private async SaveConf(message: Message, config: ResolvedGuildConfiguration) {
        await this.Save(this.CurrentConfiguration, config);
        if (message?.editable == true) message.edit({

        })
    }

    private isEnd(array: any[], pos: number) {
        return pos == (array.length - 1);
    }

    private GenerateEmbed(interaction: Interaction, conf: ResolvedGuildConfiguration) {
        const configuration = conf.raw;
        const Information = ModuleInformation[this.Module];
        const EmojiId = /<(a)?:\w+:(\d{18})>/ig.exec(Information.Icon)[2];
        const Emoji = interaction.client.emojis.cache.get(EmojiId)
        const Render = (e: Omit<GenerateEmbedResult, "Children">) => {
            if (e.Type == ConfigurationButtonType.Boolean) return TextBoolean(
                configuration[e.Item] as boolean,
                e.Name
            );
            else if (e.Type == ConfigurationButtonType.String) return configuration[e.Item] as string;
        }
        const Fields = this.EmbedGenerator(configuration, conf).map(e => {
            let text = Render(e);
            if (e.Children != null) text += e.Children.map(e => Render(e)).join("\n");
            return text;
        }).map((e, i) => this.isEnd(Fields, i) ? `${Icons.StemEnd} ${e}` : `${Icons.StemItem} ${e}`).join("\n");
        return new Embed(interaction.guild)
            .setTitle(`Managing ${Information.Label}`)
            .addFields([{
                name: "About this module",
                value: Information.Description
            }, {
                name: "Current Configuration",
                value: Fields
            }]);
    }

    private breakArrayIntoGroups<T extends any = any>(data: T[], maxPerGroup: number): T[][] {
        var groups = [];
        for (var index = 0; index < data.length; index += maxPerGroup) {
            groups.push(data.slice(index, index + maxPerGroup));
        }
        return groups;
    };

    private ResolveComponents<T extends AnyComponentBuilder = AnyComponentBuilder>(components: T[]): ActionRowBuilder<T>[] {
        return this.breakArrayIntoGroups<T>(components, 5).map(e =>
            new ActionRowBuilder<T>()
                .addComponents(
                    e
                )
        );
    };

    async ExecuteInteraction(interaction: AnySelectMenuInteraction, client: Client, values: string[]) {
        const Configuration = await client.Storage.Configuration.forGuild(interaction.guild);

        const ButtonIds = [];
        const Components = () =>
            this.ResolveComponents<ButtonBuilder>([
                BackComponent,
                ...this.Buttons.map(e => {
                    const item = Configuration.raw[e.Item];
                    ButtonIds.push(e.Item);
                    return new ButtonBuilder()
                        .setLabel(e.Label)
                        .setStyle(
                            typeof item == "boolean" ? ButtonBoolean(item) : (
                                e.DefaultStyle ?? ButtonStyle.Secondary
                            )
                        )
                        .setCustomId(e.Item);
                })
            ]);

        const Message = await interaction.update({
            fetchReply: true,
            embeds: [
                this.GenerateEmbed(interaction, Configuration)
            ],
            components: Components()
        });

        const Collector = Message.createMessageComponentCollector({
            time: 0,
            componentType: ComponentType.Button,
            filter: Filter({
                member: interaction.member,
                customIds: [...ButtonIds, [ButtonCollector.BackButton]]
            })
        });

        Collector.on("collect", async button => {
            const Button = this.GetButton(button);
            if (Button.Type == ConfigurationButtonType.Boolean) return;
            else if (Button.Type == ConfigurationButtonType.String) this.StringButton(
                button,
                Configuration
            );
        });

        ButtonCollector.AttachBackButton(Collector);
    }

    async toJSON() {
        const This = this;
        return class ModuleConfigurationBuilder extends SelectOptionBuilder {
            constructor() {
                super({
                    GuildOnly: true,
                    RequiredPermissions: [],
                    SomePermissions: Permissions.Manager,
                    Value: This.Module
                });
            }

            public ExecuteInteraction = this.ExecuteInteraction;
        }
    }
}