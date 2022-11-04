import { StylesConfig } from "react-select";

export const colourStyles: StylesConfig = {
    //control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    control: (styles) => ({
        ...styles,
        backgroundColor: "#252629",
        color: "white"
    }),
    input: (styles) => ({
        ...styles,
        color: "white"
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
        ...styles,
        color: "black"
    }),
    singleValue: (styles) => ({
        ...styles,
        color: "#b9bbbe"
    })
}