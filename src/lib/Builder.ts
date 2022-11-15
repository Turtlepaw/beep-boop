export enum CommandBuilderType {
    ContextMenu = "CONTEXT_MENU",
    ChatInput = "CHAT_INPUT"
}

export interface BuilderOptions {
    type: CommandBuilderType;
}