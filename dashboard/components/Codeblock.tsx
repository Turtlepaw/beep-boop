import React from "react";
import Highlight from "react-highlight";

export interface BasicProperties {
  children: React.ReactNode;
  className?: string;
}

export function Codeblock({ children, className }: BasicProperties) {
  return (
    <div
      className={`bg-[#2f3136] px-2 py-2 border-[#202225] rounded-[.3rem] ${className}`}
    >
      {/* @ts-expect-error mismatch with react-highlight? */}
      <Highlight
        language="javascript"
        //@ts-expect-error
        children={children}
      />
    </div>
  );
}
