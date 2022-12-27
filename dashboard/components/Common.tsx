import { Badge, Tooltip } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Configuration } from "../pages/_app";

interface useBadgeOptions {
    text: string,
    fontColor: string,
    className: string,
    fontSize: number | string,
    width: number | string,
    height: number | string,
    borderRadius: number,
    backgroundColor: string
}

interface useBadgeLazyOptions {
    text?: string,
    fontColor?: string,
    className?: string,
    fontSize?: number | string,
    width?: number | string,
    height?: number | string,
    borderRadius?: number,
    backgroundColor?: string
}

const ComingSoonPreset = (style: string, label: string) => ({
    text: label.toUpperCase(),
    fontColor: "white",
    className: `${style} pt-es`,
    fontSize: 20,
    borderRadius: 25,
    // width: 500,
    // height: 10,
    backgroundColor: Configuration.Color
});

function defaultPreset(label: string, extraOptions?: useBadgeLazyOptions) {
    //Use the default preset
    const preset: useBadgeOptions = {
        text: label,
        fontColor: "white",
        className: "pt-es",
        fontSize: 23,
        borderRadius: 25,
        width: 20,
        height: 10,
        backgroundColor: "#5865f2"
    }
    //Merge the extra options using Object.assign
    const options = Object.assign(preset, extraOptions)
    if (extraOptions?.className) {
        options.className.replaceAll("{defaults}", "pt-es")
    }
    return options;
}

export const Presets = {
    ComingSoon: ComingSoonPreset as (className: string, label: string) => useBadgeOptions,
    defaultPreset
}

interface useBadgeProps {
    preset: useBadgeOptions;
}

export function CustomBadge(props: useBadgeProps) {
    const options = props.preset;
    return <Badge
        backgroundColor={options.backgroundColor}
        textColor={options.fontColor}
        className={options.className}
        height={options.height}
        width={options.width}
        fontSize={options.fontSize}
        borderRadius={options.borderRadius}
        textAlign="center">
        {options.text}
    </Badge>;
}

export function CustomTooltip(props: {
    children: ReactNode;
    innerText?: ReactNode;
}) {
    return (
        <Tooltip label={props.children}>
            {
                props.innerText ?
                    props.innerText :
                    <img src="/QuestionMark.svg" />
            }
        </Tooltip>
    )
}