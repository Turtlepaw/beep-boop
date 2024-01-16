import {
    Box,
    Button,
    Center,
    Heading,
    Text,
    Tooltip
} from "@chakra-ui/react";
import React, { CSSProperties, MouseEventHandler, useState } from "react";
import Image from "next/image";

export interface MentionProperties {
    children: React.ReactNode;
}

interface InternalMentionProperties extends MentionProperties {
    hover?: CSSProperties;
    onClick?: MouseEventHandler<HTMLDivElement>;
    isActive?: boolean;
}

export interface UserMentionProperties extends MentionProperties {
    isFormsBot?: boolean;
    avatar?: string;
    text?: string;
}

export interface FormProfileProperties {
    children: React.ReactNode;
    avatar: string;
    hidden: boolean;
    HandleInteraction: MouseEventHandler<HTMLDivElement>;
}

/**
 * 
 * @param {import("@chakra-ui/react").CSSObject} hover
 * @returns 
 */
export function Mention({ children, hover, onClick, isActive }: InternalMentionProperties) {
    return (
        <Box onClick={onClick} display="inline" bgColor={isActive ? "#5865f2" : "#3e4372"} paddingTop="0.2" paddingBottom="0.5" marginX={0.2} paddingX={1} borderRadius={4} _hover={{
            bgColor: "#5865f2",
            ...hover
        }} cursor="pointer" style={isActive ? hover : undefined}>
            {children}
        </Box>
    )
}

export function SlashCommand({ children }: MentionProperties) {
    return (
        <Mention>
            /{children}
        </Mention>
    )
};

const Invite = "https://discord.com/oauth2/authorize?client_id=942858850850205717&permissions=3072&scope=applications.commands%20bot";
export function FormProfile({ children, avatar, hidden, HandleInteraction }: FormProfileProperties) {
    return (
        <Tooltip hasArrow pointerEvents="all" isOpen={!hidden} zIndex={10000} backgroundColor="#292b2f" padding={5} borderRadius={5} ml={2} label={
            <Box>
                <Box paddingTop='4px' paddingRight='4px' cursor='pointer' float="right" onClick={HandleInteraction}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#b9bbbe" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z" />
                    </svg>
                </Box>
                <Center>
                    <Image
                        alt="Avatar"
                        src={avatar}
                        width={12}
                        style={{
                            marginBottom: 2,
                            borderRadius: 1000000
                        }}
                    />
                </Center>
                <Box pb={2} textAlign="center">
                    <Center>
                        <Heading size="md">Forms<Text display="inline" color="#b9bbbe">#5609</Text></Heading>
                        <Box display='inline-flex' backgroundColor='#5865F2' borderRadius='.1875rem' ml='4px' height='.9375rem' width='39px'>
                            <Tooltip hasArrow label={
                                <Box>
                                    Verified Bot
                                </Box>
                            } placement='top' shouldWrapChildren bg="#18191c" borderRadius={6} padding='6px 12px'>
                                <svg width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg>
                            </Tooltip>
                            <Text fontFamily='Whitney Bold' fontSize='.625rem'>BOT</Text>
                        </Box>
                    </Center>
                    <Text>Create custom in-app modals and send submissions to a channel using webhooks.</Text>
                </Box>
                <a href={Invite} target="_blank" rel="noreferrer noopener">
                    <Center>
                        <Button variant="primary" width="full" rightIcon={<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15">
                            <path fill="white" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
                            <polygon fill="white" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
                        </svg>}>Add to Server</Button>
                    </Center>
                </a>
            </Box>
        } shouldWrapChildren>
            {children}
        </Tooltip>
    );
}

export function UserMention({ children, isFormsBot, avatar, text }: UserMentionProperties) {
    if (children === "Forms") isFormsBot = true;
    if (avatar == null && isFormsBot) avatar = "https://cdn.discordapp.com/avatars/942858850850205717/35f7b68f8f64be0df28554968531bcd2?size=4096";
    if (avatar == null) avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
    const [hidden, setHidden] = useState(true);
    const HandleInteraction = () => {
        if (isFormsBot) setHidden(!hidden);
    }
    return (
        <FormProfile {...{ avatar, HandleInteraction, hidden }}>
            <Mention isActive={!hidden} hover={{ textDecoration: "underline" }} onClick={HandleInteraction}>
                {(avatar != null && !isFormsBot) && <Image
                    alt="Form's Avatar"
                    src={avatar}
                    width={5}
                    style={{
                        display: "inline",
                        borderRadius: 100000,
                        marginBottom: "0.5",
                        marginRight: 1
                    }}
                />}
                <Text display="inline" textColor={text ?? "currentcolor"}>@{children}</Text>
            </Mention>
        </FormProfile>
    );
}
