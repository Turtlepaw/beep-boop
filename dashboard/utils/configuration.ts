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
