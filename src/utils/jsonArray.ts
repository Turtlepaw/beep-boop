export class JSONArray<type = any> {
    public array: type[] = [];

    push(...item: type[]) {
        return this.array.push(...item);
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
}