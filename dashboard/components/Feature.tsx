import React from "react";
import { Image } from "./Image";

export function FeatureIcon({ Icon }: {
    Icon: string;
}) {
    return (
        <div className="inline p-3 border border-white/20 rounded-md w-fit h-fit mr-5">
            <Image src={Icon} className="inline" width={30} alt="Feature Icon" />
        </div>
    )
}

export function FeatureTitle({ children }: {
    children: React.ReactNode;
}) {
    return (
        <h1 className="font-semibold text-xl max-w-xs">{children}</h1>
    );
}

export function FeatureDescription({ children }: {
    children: React.ReactNode;
}) {
    return (
        <h1 className="text-light max-w-xs text-lg">{children}</h1>
    );
}

export function Feature({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid-flow-col grid justify-start mt-8 FlexItem mx-5">
            {children}
        </div>
    )
}

export function FeatureText({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            {children}
        </div>
    )
}