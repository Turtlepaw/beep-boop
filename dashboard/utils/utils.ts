export function CreateHandler(value: any, set: any, other?: any) {
    return ((e: any) => {
        set(e.target.value)
        try {
            other();
        } catch (e) {

        }
    });
}