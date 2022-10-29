import { Center } from "@chakra-ui/react";
import { DefaultProps } from "../utils/parse-user";

export interface MenuProps extends DefaultProps {
    isDashboard?: boolean;
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
        <Center>
            <div className='card px-4 py-2'>
                {
                    props.user != null ? (
                        <>
                            {/*<img src={props.user.avatarURL} className="w-14 rounded-full" />*/}
                            <h2 className='DiscordTag font-semibold'>Logged in as</h2>
                            <h3 className='font-semibold text-lg'>{props.user?.username}#{props.user.discriminator}</h3>
                            <Center>
                                <a className='pt-0.5 DiscordTag hover:underline inline hover:opacity-80' href={props.isDashboard ? "/" : "/dashboard"}>
                                    {props.isDashboard ? "Home" : "Dashboard"}
                                    <ExternalIcon />
                                </a>
                            </Center>
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
        </Center>
    );
}