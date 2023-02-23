import { CSSProperties } from "react";
import { Configuration } from "../../utils/configuration";
import { ExternalIcon } from "../Layout/Menu";
import { BrandBg, BrandBorder, BrandColor } from "../../utils/styles";
import NextLinkAlias from "next/link";

// Alias to next/link
export const NextLink = NextLinkAlias;

export interface LinkProperties {
    href: string;
    children: React.ReactNode;
    onBrand?: boolean;
    isExternal?: boolean;
    isNewTab?: boolean;
    className?: string;
    textColor?: string;
    externalIconColor?: string;
}

export function Link({ children, href, onBrand = true, isExternal, isNewTab, className, textColor, externalIconColor }: LinkProperties) {
    if (isExternal != false && (
        href.startsWith("https://") ||
        href.startsWith("http://")
    )) isExternal = true;
    if (isExternal == true && isNewTab != false) isNewTab = true;

    const Style: CSSProperties = {
        color: textColor ?? (onBrand ? Configuration.Color : "#5865f2")
    }

    return (
        <NextLink href={href} style={Style} className={`hover:underline underline hover:opacity-90 ${className}`} target={isNewTab ? "_blank" : null}>
            {children}
            {isExternal && <ExternalIcon color={externalIconColor ?? "currentColor"} />}
        </NextLink>
    )
}

export {
    BrandBg,
    BrandColor,
    BrandBorder
}

export class Links {
    static get Discord() {
        return (
            <Link href='/discord' isExternal>Discord</Link>
        );
    }
}