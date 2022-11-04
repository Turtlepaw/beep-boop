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

export function Menu(props: MenuProps) {
    return (
        <div className="!float-right pr-5 pt-5">
            <div>
                {
                    props.user != null ? (
                        <>
                            <ChakraMenu>
                                {({ isOpen }) => (
                                    <>
                                        <MenuButton className="hover:opacity-75">
                                            {/** @ts-expect-error */}
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
                        <>
                            <h3 className='font-semibold text-lg'>😢 Your not logged in, yet!</h3>
                            <a className='pt-0.5 DiscordTag hover:underline inline hover:opacity-80' href='/api/oauth'>
                                Login
                                <svg className="icon outbound ml-0.5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15">
                                    <path fill={"currentColor"} d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
                                    <polygon fill={"currentColor"} points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
                                </svg>
                            </a>
                        </>
                    )
                }
            </div>
        </div >
    );
}