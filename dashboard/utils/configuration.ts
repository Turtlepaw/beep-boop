import { CSSProperties } from "react";
import { WebsiteConfiguration } from "../pages/_app";

export const Configuration: WebsiteConfiguration = {
    TagLine: "Modern bot for the 21st century",
    WebsiteURL: "https://bop.trtle.xyz/",
    Title: "Beep Boop",
    Icon: {
        SVG: "/Robot.svg",
        PNG: "/Robot.png"
    },
    Description: "Beep Boop is a modern bot designed for large servers.",//"Beep Boop is a multipurpose Discord bot built with large community servers in mind.",
    Color: "#ff5c5e"
}

export const BrandColor: CSSProperties = {
    color: Configuration.Color
}

export const BrandBg: CSSProperties = {
    backgroundColor: Configuration.Color
}

export const BrandBorder: CSSProperties = {
    borderColor: Configuration.Color
}
