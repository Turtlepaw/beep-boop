import Head from "next/head";
import { Configuration } from "../pages/_app";

export interface MetaProperties {
    children: string;
}

export function Meta({ children: Title }: MetaProperties) {
    return (
        <Head>
            <title>{Configuration.Title} - {Title == null ? "" : ` ${Title}`}</title>
            <link rel="icon" href={Configuration.Icon.SVG} />
            {/* Primary Meta Tags */}
            <meta name="title" content={Title || Configuration.Title} />
            <meta name="description" content={Configuration.Description} />
            <meta name="theme-color" content={Configuration.Color} />
            <meta property="og:image" content={Configuration.Icon.PNG} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="250" />
            <meta property="og:image:height" content="250" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={Configuration.WebsiteURL} />
            <meta property="og:title" content={Title || Configuration.Title} />
            <meta property="og:description" content={Configuration.Description} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={Configuration.WebsiteURL} />
            <meta property="twitter:title" content={Title || Configuration.Title} />
            <meta property="twitter:description" content={Configuration.Description} />
            <meta property="twitter:image" content={Configuration.Icon.PNG} />
        </Head>
    );
}