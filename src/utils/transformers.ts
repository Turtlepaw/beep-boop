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
        return JSON.stringify(
            Array.from(values.values())
        );
    }

    from(value: T[]) {
        return new Set<T>(value);
    }
}

export class MapTransformer<K, V> {
    to(values: Map<K, V>) {
        const array: [K, V][] = [];
        for (const [k, v] of values.entries()) array.push([k, v]);
        return JSON.stringify(array);
    }

    from(values: [K, V][]) {
        const map = new Map<K, V>();
        for (const [k, v] of values) map.set(k, v);
        return map;
    }
}