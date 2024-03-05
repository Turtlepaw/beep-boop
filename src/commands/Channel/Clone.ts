import {
  CategoryChannel,
  CategoryCreateChannelOptions,
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Command, { Categories } from "../../lib/CommandBuilder";
import { Icons } from "../../configuration";

export default class Channel extends Command {
  constructor() {
    super({
      CanaryCommand: false,
      Description: "Clone channels, categories and roles.",
      GuildOnly: true,
      Name: "clone",
      RequiredPermissions: [],
      SomePermissions: [PermissionFlagsBits.ManageChannels],
      Category: Categories.Server,
      ClientPermissions: [PermissionFlagsBits.ManageChannels],
      Subcommands: [
        new SlashCommandSubcommandBuilder()
          .setName("channel")
          .setDescription("Clone a channel.")
          .addChannelOption((e) =>
            e
              .setName("channel")
              .setDescription("The channel to clone.")
              .setRequired(true)
          ),
        new SlashCommandSubcommandBuilder()
          .setName("category")
          .setDescription("Clone a category, with or without the channels.")
          .addChannelOption((e) =>
            e
              .setName("category")
              .addChannelTypes(ChannelType.GuildCategory)
              .setDescription("The category to clone")
              .setRequired(true)
          )
          .addBooleanOption((e) =>
            e
              .setName("with_channels")
              .setDescription("If you want the channels to be cloned too.")
          ),
        new SlashCommandSubcommandBuilder()
          .setName("role")
          .setDescription("Clone a role.")
          .addRoleOption((e) =>
            e
              .setName("role")
              .setDescription("The role to clone")
              .setRequired(true)
          ),
      ],
    });
  }

  async ExecuteCommand(interaction: ChatInputCommandInteraction) {
    enum Subcommands {
      Channel = "channel",
      Role = "role",
      Category = "category",
    }
    const Subcommand = interaction.options.getSubcommand() as Subcommands;

    if (Subcommand == Subcommands.Category) {
      const Category = interaction.options.getChannel(
        "category"
      ) as CategoryChannel;
      const Channels = Category.children;
      const WithChannels = interaction.options.getBoolean("with_channels");
      const CreatedCategory = await Category.clone();

      if (WithChannels) {
        for (const Channel of Channels.cache.values()) {
          const Options: CategoryCreateChannelOptions = {
            name: Channel.name,
            type: Channel.type,
            permissionOverwrites: Channel.permissionOverwrites.cache,
            position: Channel.position,
          };

          if (Channel.type == ChannelType.GuildText) {
            Options.topic = Channel.topic;
            Options.nsfw = Channel.nsfw;
            Options.rateLimitPerUser = Channel.rateLimitPerUser;
          }

          if (Channel.type == ChannelType.GuildForum) {
            Options.availableTags = Channel.availableTags;
            Options.defaultReactionEmoji = Channel.defaultReactionEmoji;
            Options.defaultAutoArchiveDuration =
              Channel.defaultAutoArchiveDuration;
            Options.defaultSortOrder = Channel.defaultSortOrder;
          }

          if (Channel.isVoiceBased()) {
            Options.bitrate = Channel.bitrate;
            Options.userLimit = Channel.userLimit;
          }

          CreatedCategory.children.create(Options);
        }
      }

      await interaction.reply({
        content: `${Icons.Flag} Category cloned: ${CreatedCategory}`,
        ephemeral: true,
      });
    } else if (Subcommand == Subcommands.Role) {
      //keep their permissions in channels too
    } else if (Subcommand == Subcommands.Channel) {
      const Channel = interaction.options.getChannel("channel");
      if (Channel.type != ChannelType.GuildText) return;
      //@ts-expect-error we'll deal with that later
      const CreatedChannel = await Channel.clone();

      await interaction.reply({
        content: `${Icons.Flag} Channel cloned: ${CreatedChannel}`,
        ephemeral: true,
      });
    }
  }
}
