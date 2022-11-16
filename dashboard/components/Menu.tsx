import { Button, Menu as ChakraMenu, Center, MenuButton, MenuItem as ChakraMenuItem, MenuList, MenuDivider } from "@chakra-ui/react";
import React from "react";
import { DefaultProps } from "../utils/parse-user";
import { DownIcon, UpIcon } from "./Icons";

export interface MenuProps extends DefaultProps {
    isDashboard?: boolean;
}

function MenuItem({ children, className }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <ChakraMenuItem _hover={{
            bgColor: "#252629"
        }} className={className}>{children}</ChakraMenuItem>
    );
}

export function ExternalIcon() {
    return (
        <svg className="icon outbound ml-0.5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15">
            <path fill={"currentColor"} d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
            <polygon fill={"currentColor"} points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
        </svg>
    );
}

export function Link({ children, href }: {
    children: React.ReactNode;
    href: string;
}) {
    return (
        <a href={href} className="px-1 hover:opacity-80">
            {children}
        </a>
    )
}

export function Menu(props: MenuProps) {
    return (
        <Center>
            <div className="pr-5 pt-5 z-50">
                <Center>
                    <a className="!inline font-bold text-2xl pr-6 hover:opacity-80" href="/">
                        Beep Boop
                    </a>
                    <div className="pr-6">
                        <Link href="/">
                            Home
                        </Link>
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </div>
                    <div className="!float-right !inline">
                        {
                            props.user != null ? (
                                <>
                                    <ChakraMenu>
                                        {({ isOpen }) => (
                                            <>
                                                <MenuButton className="hover:opacity-75">
                                                    <img src={props.user.avatarURL} className="w-8 mr-0.5 rounded-full inline" />
                                                    {
                                                        isOpen ? (
                                                            <UpIcon className="w-5 inline" />
                                                        ) : (
                                                            <DownIcon className="w-5 inline" />
                                                        )
                                                    }
                                                </MenuButton>
                                                <MenuList bgColor="#1e1f22" >
                                                    <a href="/dashboard">
                                                        <MenuItem>My Servers</MenuItem>
                                                    </a>
                                                    <a href="/api/logout">
                                                        <MenuItem className="!text-red-500">Logout</MenuItem>
                                                    </a>
                                                </MenuList>
                                            </>
                                        )}
                                    </ChakraMenu>
                                </>
                            ) : (
                                <a href="/api/oauth" className="hover:opacity-80">
                                    <div className="bg-gray-600 px-1.5 py-1.5 rounded-full inline-block">
                                        <img src="/Icons/Member.svg" className="w-7" />
                                    </div>
                                </a>
                            )
                        }
                    </div>
                </Center>
            </div >
        </Center>
    );
}