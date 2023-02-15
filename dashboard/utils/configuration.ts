import { CSSProperties } from "react";
import { WebsiteConfiguration } from "../pages/_app";

export const Configuration: WebsiteConfiguration & { Icon: { ColoredSVG: string } } = {
    TagLine: "Modern bot for the 21st century",
    WebsiteURL: "https://bop.trtle.xyz/",
    Title: "Beep Boop",
    Icon: {
        SVG: "/Robot.svg",
        PNG: "/Robot.png",
        ColoredSVG: "/RobotColored.svg"
    },
    Description: "Beep Boop is a modern bot designed for large servers.",//"Beep Boop is a multipurpose Discord bot built with large community servers in mind.",
    Color: "#ff5c5e"
}

export const BrandColor: CSSProperties = {
    color: Configuration.Color
}

export const LightText: CSSProperties = {
    color: "#afafaf"
}

export const LighterText: CSSProperties = {
    color: "#d0d3d8"
}

export const BrandBg: CSSProperties = {
    backgroundColor: Configuration.Color
}

export const BrandBorder: CSSProperties = {
    borderColor: Configuration.Color
}
