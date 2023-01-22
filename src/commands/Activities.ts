import { ChatInputCommandInteraction, Client, GuildMember, PermissionFlagsBits, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { MultiplayerRockPaperScissors, RockPaperScissors } from "@airdot/activities";
import { InteractionError, SendError } from "../utils/error";
import { TriviaManager } from 'discord-trivia';
import TriviaSubcommandBuilder from "../lib/TriviaCommandBuilder";

const CommandData = new TriviaSubcommandBuilder("start", "❓ Play some trivia.");

const trivia = new TriviaManager();

export default class Activities extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Start an activity.",
            GuildOnly: false,
            Name: "activity",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Activites,
            Subcommands: [
                new SlashCommandSubcommandBuilder()
                    .setName("rock_paper_scissors")
                    .setDescription("🪨📄✂️ Rock Paper Scissors!")
                    .addUserOption(e =>
                        e.setName("member")
                            .setDescription("Play with a friend, select the member to invite below.")
                    ),
                new SlashCommandSubcommandGroupBuilder()
                    .setName("trivia")
                    .setDescription("Trivia game stuff")
                    .addSubcommand(CommandData.toBuilder())
                    .addSubcommand(subcmd =>
                        subcmd.setName("end")
                            .setDescription("Ends the current game. Must be the owner of the game or a moderator.")
                    )
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        enum Subcommands {
            RockPaperScissors = "rock_paper_scissors",
            Trivia = "start",
            EndTriviaGame = "end"
        }
        const SubcomamndName = interaction.options.getSubcommand();
        if (SubcomamndName == Subcommands.RockPaperScissors) {
            const Member = interaction.options.getMember("member");
            if (Member != null) {
                if (!(Member instanceof GuildMember)) {
                    SendError(interaction, "CANNOT PROCESS REQUEST: INVALID GUILD MEMBER")
                    return;
                }
                new MultiplayerRockPaperScissors()
                    .setMember(Member)
                    .StartGame(interaction);
            } else {
                new RockPaperScissors()
                    .StartGame(interaction)
            }
        } else if (SubcomamndName == Subcommands.Trivia) {
            const Options = CommandData.getOptions(interaction);
            const game = trivia.createGame(interaction, {
                ...Options
            });

            game.start();

            client.TriviaGames.set(interaction.channel.id, game);
        } else if (SubcomamndName == Subcommands.EndTriviaGame) {
            const Game = client.TriviaGames.get(interaction.channel.id);
            if (Game.hostMember.id != interaction.user.id && interaction.memberPermissions.any([
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ModerateMembers
            ])) return InteractionError({
                createError: false,
                interaction,
                ephemeral: true,
                message: `You must be the host or you must have have the Manage Messages permission to end a trivia game.`
            });

            Game.end();
            await interaction.reply({
                content: `📜 The ongoing game has been ended.`
            });
        }
    }
}