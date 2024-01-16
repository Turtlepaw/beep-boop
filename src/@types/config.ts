import { InteractionReplyOptions } from "discord.js";

export interface Logging {
    DM?: string;
    Error?: string;
    Guild: string;
    Feedback: string;
}

export interface SavedMessages {
    [key: string]: InteractionReplyOptions;
}