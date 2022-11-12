import { KeyFileStorage } from "key-file-storage/dist/src/key-file-storage";

export class StorageManager {
    public Storage: KeyFileStorage;
    constructor(storage: KeyFileStorage) {
        this.Storage = storage;
    }

    Get(key: string) {
        return this.Storage[key];
    }

    GetArray(key: string) {
        const value: string[] = this.Storage[key];
        if (value == null) return [];
        return value;
    }

    Create(key: string, value: any) {
        this.Storage[key] = value;
    }

    HasInArray(key: string) {
        const value: string[] = this.Storage[key];
        if (value == null) return false;
        return value.find(e => e == key) != null;
    }
}