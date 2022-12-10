export enum ArrayType {
    JSONArray = "JSON_ARRAY",
    DefaultArray = "DEFAULT_ARRAY"
}

export class JSONArray<type = any> {
    public array: type[] = [];
    public type = ArrayType.JSONArray;

    push(...item: type[]) {
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

    static from(json: any) {
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