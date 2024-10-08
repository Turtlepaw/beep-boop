import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import {
    TriviaGame,
    GameOptions

} from "discord-trivia";

export default class TriviaSubcommandBuilder {
    private build: SlashCommandSubcommandBuilder;
    private isApplied = false;

    constructor(name?: string, description?: string) {
        this.build = new SlashCommandSubcommandBuilder()
            .setName(name ?? "trivia")
            .setDescription(description ?? "Create a trivia game.");
    }

    private optionApplicators = {
        maximumPlayerCount: () => {
            this.build.addIntegerOption((opt) =>
                opt
                    .setName("maximum_player_count")
                    .setDescription(
                        "The maximum amount of players allowed to join this game"
                    )
                    .setRequired(false)
            );
        },
        minimumPlayerCount: () => {
            this.build.addIntegerOption((opt) =>
                opt
                    .setName("minimum_player_count")
                    .setDescription(
                        "The minimum amount of players required to start the game"
                    )
                    .setRequired(false)
            );
        },
        questionAmount: () => {
            this.build.addIntegerOption((opt) =>
                opt
                    .setName("question_amount")
                    .setDescription("The number of questions")
                    .setRequired(false)
            );
        },
        questionDifficulty: () => {
            this.build.addStringOption((opt) =>
                opt
                    .setName("question_difficulty")
                    .setDescription("The difficulty all questions should be")
                    .addChoices(
                        { name: "Easy", value: "easy" },
                        { name: "Medium", value: "medium" },
                        { name: "Hard", value: "hard" }
                    )
                    .setRequired(false)
            );
        },
        questionType: () => {
            this.build.addStringOption((opt) =>
                opt
                    .setName("question_type")
                    .setDescription("The question type for all questions")
                    .addChoices(
                        { name: "Multiple Choice", value: "multiple" },
                        { name: "false/False", value: "boolean" }
                    )
                    .setRequired(false)
            );
        },
        queueTime: () => {
            this.build.addIntegerOption((opt) =>
                opt
                    .setName("queue_time")
                    .setDescription("How long to wait for players to join before starting the game (e.g. 5m 2s)")
                    .setRequired(false)
            );
        },
        timePerQuestion: () => {
            this.build.addIntegerOption((opt) =>
                opt
                    .setName("time_per_question")
                    .setDescription("How long each round should last (e.g. 5m 2s)")
                    .setRequired(false)
            );
        },
        triviaCategory: () => {
            this.build.addStringOption((opt) =>
                opt
                    .setName("category")
                    .setDescription("The category for the questions")
                    .addChoices(
                        { name: "General Knowledge", value: "9" },
                        { name: "Entertainment: Books", value: "10" },
                        { name: "Entertainment: Film", value: "11" },
                        { name: "Entertainment: Music", value: "12" },
                        { name: "Entertainment: Musicals and Theatres", value: "13" },
                        { name: "Entertainment: Television", value: "14" },
                        { name: "Entertainment: Video Games", value: "15" },
                        { name: "Entertainment: Board Games", value: "16" },
                        { name: "Science and Nature", value: "17" },
                        { name: "Science: Computers", value: "18" },
                        { name: "Science Mathematics", value: "19" },
                        { name: "Mythology", value: "20" },
                        { name: "Sports", value: "21" },
                        { name: "Geography", value: "22" },
                        { name: "History", value: "23" },
                        { name: "Politics", value: "24" },
                        { name: "Art", value: "25" },
                        { name: "Celebrities", value: "26" },
                        { name: "Animals", value: "27" },
                        { name: "Vehicles", value: "28" },
                        { name: "Entertainment: Comics", value: "29" },
                        { name: "Science: Gadgets", value: "30" },
                        { name: "Entertainment: Japanese Anime and Manga", value: "31" },
                        { name: "Entertainment: Cartoon and Animations", value: "32" }
                    )
                    .setRequired(false)
            );
        }
    };

    private applyOptions() {
        Object.values(this.optionApplicators).forEach((func) => func());
    }

    toJSON() {
        if (!this.isApplied) {
            this.applyOptions();
            this.isApplied = false;
        }
        return this.build.toJSON();
    }

    toBuilder() {
        if (!this.isApplied) {
            this.applyOptions();
            this.isApplied = true;
        }
        return this.build;
    }

    getOptions(
        int: ChatInputCommandInteraction
    ) {
        const maximumPlayerCount = int.options.get("maximum_player_count", false)
            ?.value as number;
        const maximumPoints = int.options.get("maximum_points", false)
            ?.value as number;
        const minimumPlayerCount = int.options.get("minimum_player_count", false)
            ?.value as number;
        const minimumPoints = int.options.get("minimum_points", false)
            ?.value as number;
        // const questionAmount = int.options.get("question_amount", false)
        //     ?.value as number;
        // const questionDifficulty = int.options.get("question_difficulty", false)
        //     ?.value as QuestionDifficulties;
        // const questionType = int.options.get("question_type", false)
        //     ?.value as QuestionTypes;
        // const queueTime = ms(int.options.getString("queue_time", false)) as number;
        // const timePerQuestion = ms(int.options.getString("time_per_question", false)) as number;
        // const triviaCategory = int.options.get("category", false)
        // ?.value as CategoryNames;
        const timeBetweenRounds = int.options.get("time_between_rounds", false)
            ?.value as number;
        const pointsPerStreakAmount = int.options.get("points_per_streak", false)
            ?.value as number;
        const maximumStreakBonus = int.options.get("max_streak_bonus", false)
            ?.value as number;
        const streakDefinitionLevel = int.options.get("streak_level", false)
            ?.value as number;

        const options = {} as GameOptions;
        options.maxPlayerCount =
            maximumPlayerCount || TriviaGame.gameOptionDefaults.maxPlayerCount;
        options.maxPoints = maximumPoints || TriviaGame.gameOptionDefaults.maxPoints;
        options.minPlayerCount =
            minimumPlayerCount || TriviaGame.gameOptionDefaults.minPlayerCount;
        options.minPlayerCount =
            minimumPlayerCount || TriviaGame.gameOptionDefaults.minPlayerCount;
        options.minPoints = minimumPoints || TriviaGame.gameOptionDefaults.minPoints;

        options.timeBetweenRounds =
            timeBetweenRounds || TriviaGame.gameOptionDefaults.timeBetweenRounds;
        options.pointsPerSteakAmount =
            pointsPerStreakAmount || TriviaGame.gameOptionDefaults.pointsPerSteakAmount;
        options.maximumStreakBonus =
            maximumStreakBonus || TriviaGame.gameOptionDefaults.maximumStreakBonus;
        options.streakDefinitionLevel =
            streakDefinitionLevel || TriviaGame.gameOptionDefaults.streakDefinitionLevel;

        //if (additionalOptions) Object.assign(options, additionalOptions);

        return options;
    }
}
