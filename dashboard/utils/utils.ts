export function CreateHandler(value: any, set: any, other?: any) {
    return ((e: any) => {
        set(e.target.value)
        try {
            other();
        } catch (e) {

        }
    });
}

export function CreateSelectHandler(value: any, set: any, other?: (e: any) => void) {
    return ((e: any) => {
        try {
            set(e?.value)
            if (other != null) other(e);
        } catch (e) {
            console.log("Error:", e)
        }
    });
}