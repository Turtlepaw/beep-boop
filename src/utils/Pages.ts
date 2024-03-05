import {
  EmbedBuilder,
  ButtonBuilder,
  EmojiIdentifierResolvable,
  Interaction,
  ActionRowBuilder,
  Message,
  ComponentType,
  ButtonStyle,
  CommandInteraction,
  ChatInputCommandInteraction,
  AnySelectMenuInteraction as SelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  ContextMenuCommandInteraction,
  BaseMessageOptions,
} from "discord.js";
import { generateId } from "./Id";
import { MessageActionRowComponentBuilder } from "discord.js";
const ufdError = Error;

export interface ButtonOptions {
  label?: string;
  emoji?: EmojiIdentifierResolvable;
  style?: ButtonStyle;
  visable?: boolean;
}

export interface BasePageButtons {
  nextButton?: ButtonOptions;
  previousButton?: ButtonOptions;
  cancelButton?: ButtonOptions;
  pageNumberButton?: ButtonOptions;
}

export interface PageButtons extends BasePageButtons {
  sorting?: {
    nextButton?: number;
    previousButton?: number;
    cancelButton?: number;
    pageNumberButton?: number;
  };
}

export interface SendOptions {
  forceButtonsDisabled?: boolean;
  ephemeral?: boolean;
  messageOptions?: BaseMessageOptions;
  disableCustomButtons?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageOptions {}

export type AnyInteraction =
  | CommandInteraction
  | ChatInputCommandInteraction
  | SelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction
  | ContextMenuCommandInteraction;
export type EventInteraction = ButtonInteraction | SelectMenuInteraction;
export type EventListener = (
  interaction: EventInteraction
) => Promise<unknown | void> | (unknown | void);

export class Pages {
  public event: EventListener = () => null;
  public embeds: EmbedBuilder[] = [];
  /**
   * This will be on the next row.
   */
  public components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  private defaultButtons: BasePageButtons = {
    cancelButton: {
      label: "✕",
      style: ButtonStyle.Danger,
      visable: true,
    },
    nextButton: {
      label: "▶",
      style: ButtonStyle.Primary,
      visable: true,
    },
    previousButton: {
      label: "◀",
      style: ButtonStyle.Primary,
      visable: true,
    },
    pageNumberButton: {
      label: "{number}/{number}", //btw {number} does not get replaced
      style: ButtonStyle.Secondary,
      visable: true,
    },
  };
  public buttons: PageButtons = {
    ...this.defaultButtons,
    sorting: {
      previousButton: 0,
      pageNumberButton: 1,
      cancelButton: 2,
      nextButton: 3,
    },
  };

  setEmbeds(embeds: EmbedBuilder[]) {
    this.embeds = embeds;
    return this;
  }

  setComponents(
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
  ) {
    this.components = components;
    return this;
  }

  /**
   * `event` will be executed once a custom component is clicked.
   */
  setEventListener(event: EventListener) {
    this.event = event;
    return this;
  }

  setButtons(buttons: ActionRowBuilder[]) {
    this.buttons = {
      ...buttons,
      ...this.buttons,
    };
    return this;
  }

  private isDisabled(buttonId: string) {
    if (buttonId == "cancelButton") {
      return false;
    }
    if (buttonId == "pageNumberButton") {
      return true;
    }
    if (this.embeds.length <= 1) {
      return true;
    }

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private renderButtons(
    sortedButtons: ButtonOptions[],
    Ids: object,
    pageIndex: number
  ) {
    const { buttons, embeds } = this;
    return sortedButtons.map((e, i) => {
      //get the key of the button
      const key = Object.keys(buttons.sorting).find(
        (k) => buttons.sorting[k] === i
      );
      const defaultButton = this.defaultButtons[key];
      const button = new ButtonBuilder()
        .setCustomId(Ids[key])
        .setLabel(
          key == "pageNumberButton"
            ? `${pageIndex + 1} of ${embeds.length}`
            : e?.label || defaultButton.label
        )
        .setStyle(e?.style || defaultButton.style)
        .setDisabled(this.isDisabled(key));

      if (e?.emoji != null) {
        button.setEmoji(e?.emoji);
      }

      return button;
    });
  }

  private getComponents(disabled = false) {
    if (this.components == null || this.components.length == 0) return [];
    return this.components.map((e) => {
      return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        e.components.map((e) => e.setDisabled(disabled))
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(
    interaction: AnyInteraction | Interaction | CommandInteraction,
    options?: SendOptions
  ) {
    const { buttons, embeds } = this;
    let pageIndex = 0;

    //sort the buttons using buttons.sorted
    const sortedButtons: ButtonOptions[] = Object.keys(buttons.sorting)
      .map((key) => {
        const button = buttons[key];
        return {
          ...button,
          ...buttons.sorting[key],
        };
      })
      .sort((a, b) => a.sorting - b.sorting)
      .filter((e) => e?.visable || true);

    const Ids = {
      cancelButton: generateId(),
      nextButton: generateId(),
      previousButton: generateId(),
      pageNumberButton: generateId(),
    };

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      this.renderButtons(sortedButtons, Ids, pageIndex)
    );

    const payload = {
      embeds: [embeds[0]],
      components: [row, ...this.getComponents()],
      ...options?.messageOptions,
    };

    let message: Message<boolean>;

    if (
      //   interaction.type == InteractionType.ApplicationCommand ||
      //   interaction.type == InteractionType.MessageComponent
      interaction.isMessageComponent() ||
      interaction.isCommand()
    ) {
      if (interaction.replied && interaction.isMessageComponent()) {
        message = await interaction.update({
          fetchReply: true,
          ...payload,
        });
      } else {
        message = await interaction.reply({
          fetchReply: true,
          ...payload,
        });
      }
    } else {
      throw new ufdError(
        "Pages can only be sent to commands or message components"
      );
    }

    const collect = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (i) => i.user.id == interaction.user.id,
    });

    collect.on("collect", async (i) => {
      if (!Object.values(Ids).includes(i.customId)) {
        if (this?.event != null) this.event(i);
        return;
      }

      if (i.customId === Ids.previousButton) {
        if (pageIndex === 0) {
          pageIndex = embeds.length - 1;
        } else {
          pageIndex--;
        }
      } else if (i.customId === Ids.nextButton) {
        if (pageIndex + 1 === embeds.length) {
          pageIndex = 0;
        } else {
          pageIndex++;
        }
      } else if (i.customId == Ids.cancelButton) {
        i.update({
          components: [
            row.setComponents(
              this.renderButtons(sortedButtons, Ids, pageIndex).map((e) =>
                e.setDisabled()
              )
            ),
            ...this.getComponents(
              options?.disableCustomButtons == null
                ? true
                : options?.disableCustomButtons
            ),
          ],
        });

        const disableCustomButtons =
          options?.disableCustomButtons == null
            ? true
            : options.disableCustomButtons;
        if (disableCustomButtons) collect.stop();

        return;
      }

      row.setComponents(this.renderButtons(sortedButtons, Ids, pageIndex));

      i.update({
        embeds: [embeds[pageIndex]],
        components: [row, ...this.getComponents()],
      }).catch(console.log);
    });
  }
}
