
import '../styles/globals.css'
import '../styles/index.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import React from 'react'
import { Footer } from '../components/Footer'

// </> Typings </>
export type URL = `${"http" | "https"}://${string}.${string}` | `/${string}` | `mailto:${string}`;
export type ImageURL = `/${string}.${"svg" | "png" | "jpg" | "jpeg"}` | URL;

export interface WebsiteConfiguration {
  Title: string;
  Icon: {
    SVG: ImageURL;
    PNG: ImageURL;
  }
  Description: string;
  /**
   * The website url for the embed.
   */
  WebsiteURL: URL;
}

// Configuration*
// ^ This is required
// This is what'll appear on your website
export const Configuration: WebsiteConfiguration = {
  WebsiteURL: "https://dash.trtle.xyz/",
  Title: "Beep Boop",
  Icon: {
    SVG: "/Robot.svg",
    PNG: "/Robot.png"
  },
  Description: "Beep Boop is a multipurpose Discord bot built with large community servers in mind."
}


const colours = {
  'blurple': '#5865F2',
  'blurple.500': '#5865F2',
  'green': '#3BA55C',
  'red': '#ED4245',
  'grey.extralight': '#ebedef',
  'grey.light': '#4F545C',
  'grey.dark': '#292b2f',
  'grey.extradark': '#1f2022',
  'bg': '#202020',
};

const { blurple, } = colours;

const theme = extendTheme({
  colors: colours,
  styles: {
    global: (props: any) => ({
      hr: {
        borderColor: "#33353b"
      },
      button: {
        _hover: {
          opacity: "85%"
        }
      },
      body: {
        bg: "#18191c"
      },
      input: {
        //bg: mode('grey.extradark', 'grey.extralight')(props),
        bg: 'transparent',
        height: '36px',
        width: '100%',
        padding: '0px 9px',
        border: `2px solid #484b52`,
        transition: '0.2s',
        outline: 'none',
        borderRadius: 3,
        _focus: { border: `2px solid #61656e` }
      },
    })
  },
  components: {
    Input: {
      defaultProps: { variant: 'normal' }
    },
    Button: {
      baseStyle: {
        color: 'white',
      },
      variants: {
        primary: {
          bg: blurple
        },
        secondary: {
          bg: 'grey.light'
        },
        success: {
          bg: 'green'
        },
        danger: {
          bg: 'red'
        },
        outline: {
          _hover: {
            bg: 'grey.light'
          }
        },
        MenuItem: {
          _hover: {
            bg: "#3c3f45"
          },
          bg: "transparent"
        },
        outlineDark: {
          border: "1px solid #222",
          bgColor: "transparent",
          _hover: {
            bg: 'rgb(50, 50, 50)'
          }
        }
      },
    }
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="Background Text">
      <ChakraProvider theme={theme}>
        <a href='/'>

        </a>
        <Head>
          <title>{Configuration.Title}</title>
          <link rel="icon" href={Configuration.Icon.SVG} />
          {/* Primary Meta Tags */}
          <meta name="title" content={Configuration.Title} />
          <meta name="description" content={Configuration.Description} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={Configuration.WebsiteURL} />
          <meta property="og:title" content={Configuration.Title} />
          <meta property="og:description" content={Configuration.Description} />
          <meta property="og:image" content={Configuration.Icon.PNG} />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={Configuration.WebsiteURL} />
          <meta property="twitter:title" content={Configuration.Title} />
          <meta property="twitter:description" content={Configuration.Description} />
          <meta property="twitter:image" content={Configuration.Icon.PNG} />
        </Head>
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </div >
  )
}

export default MyApp