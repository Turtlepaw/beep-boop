import { ApiCommandData as apiCommandData } from "./deploy";

enum KnownCommands {
    Configuration = "configuration"
}

type ApiCommandData = apiCommandData & {
    toString: () => string
};

export class CommandDataManager {
    private data: ApiCommandData[];
    public knownCommands = KnownCommands;

    constructor(data: ApiCommandData[]) {
        this.data = data;
    }

    public getCommand(name: string): ApiCommandData {
        const command = this.data.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
        return {
            ...command,
            toString: () => `</${command.name}:${command.id}>`
        };
    }

    get allCommands() {
        return this.data;
    }
}