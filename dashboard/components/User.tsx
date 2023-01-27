import { Button, Center } from "@chakra-ui/react";
import { AutoCenter } from "./AutoCenter";
import { Meta } from "./Meta";
import { Image, Images } from "./Image";
import { Link } from "./Link";
import { DefaultProps } from "../utils/parse-user";
import { Menu } from "./Menu";

export function NotLoggedIn(props: DefaultProps) {
    return (
        <>
            <Menu {...props} />
            <Meta>Not Logged In</Meta>
            <div className='py-20'>
                <AutoCenter>
                    <Center>
                        <Image className='mr-2' src="https://raw.githubusercontent.com/Turtlepaw/fluent-emojis/master/Emojis/Smilies/Crying%20Face.png" alt="Sad Face" width={30} />
                        <h1 className='font-semibold text-2xl'>You're not logged in!</h1>
                    </Center>
                    <p className='font-medium max-w-sm text-center text-lg pt-1'>You need to log in with your <Link href="/api/oauth" isExternal onBrand={false}><b className="font-semibold"><Images.Discord className="inline" /> Discord</b> account</Link> to access this page.</p>
                    <Center className='pt-5'>
                        <a className='inline px-1.5' href='/api/oauth'>
                            <Button variant="primary" leftIcon={<Image width={25} src="/Icons/PersonLogin.svg" alt="Login Icon" />} className='inline'>Login</Button>
                        </a>
                        <a className='inline px-1.5' href='/'>
                            <Button variant="secondary" leftIcon={<Image width={25} src="/Icons/Return.svg" alt="Return back home" />} className='inline'>Back Home</Button>
                        </a>
                    </Center>
                </AutoCenter>
            </div>
        </>
    );
}