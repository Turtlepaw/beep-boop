import React from "react";
import Highlight from "react-highlight";

export interface BasicProperties {
    children: React.ReactNode;
    className?: string;
}

export function Codeblock({ children, className }: BasicProperties) {
    return (
        <div className={`bg-[#2f3136] px-2 py-2 border-[#202225] rounded-[.3rem] ${className}`}>
            <Highlight

                //@ts-expect-error
                language="javascript">
                {children}
            </Highlight >
        </div>
    )
}