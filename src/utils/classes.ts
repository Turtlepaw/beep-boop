export class ArrayUtils {
    static AdvancedSearch<T>(array: T[], finder: (item: T) => boolean) {
        for (const item of array) {
            const result = finder(item);
            if (result == true) return {
                Result: true,
                Item: item
            };
            else continue;
        }

        return {
            Result: false,
            Item: null
        };
    }
}