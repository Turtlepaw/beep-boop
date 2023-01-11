import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import { AutoCenter } from '../components/AutoCenter';
import { ExternalIcon, Menu } from '../components/Menu';
import { DefaultProps, parseUser } from '../utils/parse-user';
import { Configuration } from './_app';
import { CSSProperties } from 'react';
import { Meta } from '../components/Meta';
import { Image } from '../components/Image';

export function Feature({ included, children }: {
    included?: boolean;
    children: React.ReactNode;
}) {
    if (included == null) included = false;
    const className = "inline";
    return (
        <div>
            {included ? (
                <img src="/Check.svg" className={className} />
            ) : (
                <img src="/Dismiss.svg" className={className} />
            )}
            {' '}{children}
        </div>
    )
}

export function BrandColor({ children, color, border: isBorder, textColor }: {
    children: string;
    color: string;
    border?: boolean;
    textColor?: "white" | "black";
}) {
    const Style: CSSProperties = {
        backgroundColor: color,
        color: textColor || "white"
    }

    return (
        <div style={Style} className={`${isBorder != null ? "border-gray-500 border-[1.3px]" : ""} mx-2 flexItem w-40 my-5 px-5 py-5 bord er-gray-500 bor der-2 rounded-lg bg-gray- 500 bg-color-secondary bg-opacity-10`}>
            <div>
                <h1 className="font-bold text-lg">{children}</h1>
                <div className="opacity-75 pt-2">
                    {color}
                </div>
            </div>
        </div>
    )
}

export function BrandAsset({ image, children: name, rounded }: {
    image: {
        svg: string;
        png: string;
    };
    children: string;
    rounded?: boolean;
}) {
    return (
        <div className="standardFlexItem forceLargeWidth h-72 mx-5 my-5 px-10 py-5 border-gray-500 border-[1.3px] rounded-lg bg-gray-500 bg-opacity-5">
            <h1 className="font-bold text-xl pb-5">{name}</h1>
            <Center>
                <img src={image.png} className={`w-32 ${rounded != null ? "rounded-2xl" : ""}`} />
            </Center>
            <div className="pt-5">
                <div className="opacity-75">
                    <img src="/Icons/Download.svg" className="inline w-4 mr-1" />
                    Download As
                </div>
                <a href={image.png} download className="inline pr-1 hover:underline">
                    <div className="pt-5 opacity-75 inline">
                        <p className="inline pt-5 pl-1">PNG</p>
                    </div>
                </a>
                <a href={image.svg} download className="inline pl-1 hover:underline">
                    <div className="pt-5 opacity-75 inline">
                        <p className="inline pt-5 pl-1">SVG</p>
                    </div>
                </a>
            </div>
        </div>
    );
}
export default function Branding(props: DefaultProps) {
    return (
        <>
            <Menu {...props} />
            <Meta>Branding</Meta>
            <div className="pb-20 pt-5">
                <AutoCenter className="text-center">
                    {/* <div>
                        <h1 className="font-bold text-4xl">Brand Assets</h1>
                        <p className='pt-2 font-medium text-lg max-w-2xl'>Here you'll find our logos, branding colors, and other brand related stuff.</p>
                    </div> */}
                    {/* <Image className='mr-2 !w-[4.3rem] !h-[4.3rem] mb-3' loading='eager' src="https://raw.githubusercontent.com/Turtlepaw/fluent-emojis/master/Emojis/Activities/Framed%20Picture.png" alt="Photo" width={200} /> */}
                    <h1 className="font-bold text-3xl">
                        Brand Images
                    </h1>
                    <p className='pt-2 pb-5 font-medium text-lg max-w-2xl'>Please do not edit, change, distort, recolor, or reconfigure our brand images.</p>
                    <Center className="flexContainer">
                        <BrandAsset image={{
                            png: "/Robot.png",
                            svg: "/Robot.svg"
                        }}>Robot</BrandAsset>
                        <BrandAsset image={{
                            png: "/icon.png",
                            svg: "/icon.svg"
                        }} rounded>Logo</BrandAsset>
                        <BrandAsset image={{
                            png: "/canary.png",
                            svg: "/canary.svg"
                        }} rounded>Canary</BrandAsset>
                        <BrandAsset image={{
                            png: "/development.png",
                            svg: "/development.svg"
                        }} rounded>Development</BrandAsset>
                    </Center>
                    <h1 className="font-bold text-3xl pt-10 pb-4">Brand Colors</h1>
                    <Center className="flexContainer">
                        <BrandColor color='#ff5f5f'>Brand Color</BrandColor>
                        <BrandColor color='#5865f2'>Blurple</BrandColor>
                        <BrandColor color='#fbb540' textColor='black'>Canary</BrandColor>
                        <BrandColor color='#18191c' border>Dark Gray</BrandColor>
                    </Center>
                </AutoCenter>
            </div >
        </>
    )
}

export const getServerSideProps: GetServerSideProps<DefaultProps> = async function (ctx) {
    const user = await parseUser(ctx);
    return {
        props: {
            user,
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};
