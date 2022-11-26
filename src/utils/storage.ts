import { KeyFileStorage } from "key-file-storage/dist/src/key-file-storage";

export class StorageManager {
    public Storage: KeyFileStorage;
    constructor(storage: KeyFileStorage) {
        this.Storage = storage;
    }

    Get<type = any>(key: string): type {
        return this.Storage[key];
    }

    GetArray<type = any>(key: string): type[] {
        const value: type[] = this.Storage[key];
        if (value == null) return [];
        return value;
    }

    Create<type = any>(key: string, value: type) {
        this.Storage[key] = value;
    }

    Delete(key: string) {
        delete this.Storage[key];
    }

    HasInArray(ArrayKey: string, key: string) {
        const value: string[] = this.Storage[ArrayKey];
        if (value == null) return false;
        return value.find(e => e == key) != null;
    }

    Edit<value = any>(key: string, newValue: value) {
        const value: value = this.Get(key);
        this.Delete(key);
        this.Create(key, {
            ...value,
            ...newValue
        });
    }

    EditArray<value = any[]>(key: string, newValue: value[]) {
        const value: value[] = this.Get(key);
        this.Delete(key);
        this.Create(key, [
            ...value,
            ...newValue
        ]);
    }
}