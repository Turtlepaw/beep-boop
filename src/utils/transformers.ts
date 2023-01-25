import { ValueTransformer } from "typeorm";

export const JSONTransformer: ValueTransformer = {
    to(value) {
        return JSON.stringify(value);
    },
    from(value) {
        return JSON.parse(value);
    },
};

export class SetTransformer<T> {
    to(values: Set<T>) {
        if (values == null) return "";
        return JSON.stringify(
            Array.from(values.values())
        );
    }

    from(value: string) {
        if (value == '') return new Set<T>();
        const Array: T[] = JSON.parse(value);
        return new Set<T>(Array);
    }
}

export class MapTransformer<K, V> {
    to(values: Map<K, V>) {
        const array: [K, V][] = [];
        for (const [k, v] of values.entries()) array.push([k, v]);
        return JSON.stringify(array);
    }

    from(values: string) {
        if (values == null || values == "") return new Map();
        const data = JSON.parse(values);
        const map = new Map<K, V>();
        for (const [k, v] of data) map.set(k, v);
        return map;
    }
}

export class DateTransformer {
    to(value: Date) {
        if (value == null) return "null";
        return value.toString()
    }

    from(value: string) {
        if (value == "null") return null;
        return new Date(value);
    }
}
