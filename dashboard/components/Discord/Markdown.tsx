import { PropsWithChildren } from "react";
import { Mention } from "./Mention";

export interface MarkdownProperties {
    getUser: (id: string) => string;
    children: string;
}

export function Markdown({ children, getUser }: MarkdownProperties) {
    const Mentions = children.split(" ");
    const newArray = [];
    Mentions.map(mention => {
        if (!/\<@([0-9]{18,19})\>/gi.test(mention)) return ` ${mention} `;
        const Id = /\<@([0-9]{18,19})\>/gi.exec(mention)[1]
        const User = getUser(Id);
        return <Mention>@{User}</Mention>
    }).forEach(e => newArray.push(e));

    return (
        <>
            {newArray}
        </>
    )
}