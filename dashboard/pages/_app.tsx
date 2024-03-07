import "../styles/globals.css";
import "../styles/index.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { Footer } from "../components/Layout/Footer";
import { NextResponse } from "next/server";
import { Configuration as config } from "../utils/configuration";
import { Analytics } from "@vercel/analytics/react";
import { SSRProvider } from "react-aria";
import { theme } from "../components/Theming";
import { SessionProvider } from "next-auth/react";

// </> Typings </>
export type URL =
  | `${"http" | "https"}://${string}.${string}`
  | `/${string}`
  | `mailto:${string}`;
export type ImageURL = `/${string}.${"svg" | "png" | "jpg" | "jpeg"}` | URL;

export interface WebsiteConfiguration {
  Title: string;
  Icon: {
    SVG: ImageURL;
    PNG: ImageURL;
  };
  Description: string;
  /**
   * The website url for the embed.
   */
  WebsiteURL: URL;
  Color: string;
  TagLine: String;
}

// Configuration*
// ^ This is required
// This is what'll appear on your website
export const Configuration = config;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="Text">
        <SSRProvider>
          <ChakraProvider theme={theme}>
            <Analytics />
            <Component {...pageProps} />
            <Footer />
          </ChakraProvider>
        </SSRProvider>
      </div>
    </SessionProvider>
  );
}

export default MyApp;
