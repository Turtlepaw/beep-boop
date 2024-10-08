/* eslint-disable @typescript-eslint/no-explicit-any */
export enum ArrayType {
    JSONArray = "JSON_ARRAY",
    DefaultArray = "DEFAULT_ARRAY"
}

/**
 * @deprecated use `simple-json` or a JSON transformer instead
 */
export class JSONArray<type = any> {
    public array: type[] = [];
    public type = ArrayType.JSONArray;

    push(...item: type[]) {
        if (Array.isArray(item[0])) item = item[0];
        this.array.push(...item);
        return this;
    }

    includes(searchElement: type) {
        return this.array.includes(searchElement);
    }

    toJSON() {
        return JSON.stringify({
            array: this.array
        });
    }

    static from<T>(json: any): JSONArray<T> {
        if (json == '') return new JSONArray();
        const ResolvedJSON = JSON.parse(json);
        const array = new JSONArray();
        array.array.push(...ResolvedJSON.array);
        return array;
    }

    static isResolvable(array: any): array is string {
        const ResolvedJSON = JSON.parse(array);
        return ResolvedJSON?.array != null;
    }

    static isArray(array: any): array is JSONArray {
        if (typeof array != 'object') return false;
        return array?.array != null && array?.type == ArrayType.JSONArray;
    }
}