import { Input } from "@chakra-ui/react";
import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { useSearchField } from "react-aria";

export interface SearchProperties {
    state: [string, Dispatch<SetStateAction<string>>];
    key: string;
}

export function SearchBar(props: SearchProperties) {
    const [value, setValue] = props.state;
    const HandleInteraction = (value: ChangeEvent<HTMLInputElement>) => setValue(value.target.value);
    const ref = useRef(null);
    //const { inputProps } = useSearchField({ "aria-label": "Server Search" }, { value: props.get, setValue: props.set }, ref);
    return (
        <Input onChange={HandleInteraction} value={value} ref={ref} key={props.key} />
    )
}