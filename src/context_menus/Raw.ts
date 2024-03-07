import ContextMenu from "../lib/ContextMenuBuilder";
import {
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  codeBlock,
} from "discord.js";

export default class Migrate extends ContextMenu {
  constructor() {
    super({
      Name: "Raw Message",
      CanaryCommand: false,
      GuildOnly: false,
      RequiredPermissions: [],
      SomePermissions: [],
      Type: ApplicationCommandType.Message,
      ClientPermissions: [],
    });
  }

  public async ExecuteContextMenu(
    interaction: MessageContextMenuCommandInteraction
  ) {
    return interaction.reply({
      ephemeral: true,
      content: codeBlock(JSON.stringify(interaction.targetMessage, null, 2)),
    });
    // const webhook = await FindLegacyWebhook(interaction.targetId, interaction.channel.id, client);
    // if (webhook == null) {
    //     FriendlyInteractionError(interaction, "Couldn't find webhook to sync with.")
    //     return;
    // }

    // await client.Storage.CustomWebhooks.Create({
    //     channelId: interaction.channel.id,
    //     url: webhook.url
    // });

    // await interaction.reply({
    //     ephemeral: true,
    //     content: "Custom message synced with database."
    // })
  }
}
