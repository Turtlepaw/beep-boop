import {
  Menu as ChakraMenu,
  Center,
  MenuButton,
  MenuItem as ChakraMenuItem,
  MenuList,
  Spinner,
  DarkMode,
  Box,
  BoxProps,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { DefaultProps } from "../../utils/parse-user";
import { DownIcon, UpIcon } from "../oldIcons";
import { BrandColor } from "../../utils/styles";
import { AutoCenter } from "./AutoCenter";
import NextLink from "next/link";
import { Configuration } from "../../utils/configuration";
import { useWindowSize } from "../../utils/window";
import { SessionContextValue, signIn, useSession } from "next-auth/react";
import { Icons } from "../icons";
import { Image } from "../Image";

export interface MenuProps {
  isDashboard?: boolean;
  user?: any;
  mobile?: boolean;
  error?: any;
}

function MenuItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ChakraMenuItem
      _hover={{
        bgColor: "#252629",
      }}
      className={className}
    >
      {children}
    </ChakraMenuItem>
  );
}

export interface SvgProperties {
  color?: string;
}

export function ExternalIcon({ color }: SvgProperties) {
  return (
    <svg
      className="icon outbound ml-0.5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      width="15"
      height="15"
    >
      <path
        fill={color ?? "currentColor"}
        d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
      ></path>
      <polygon
        fill={color ?? "currentColor"}
        points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
      ></polygon>
    </svg>
  );
}

export function Link({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <NextLink href={href} className="px-1 hover:opacity-80">
      {children}
    </NextLink>
  );
}

export function Avatar({ ...props }: BoxProps & { transparent?: boolean }) {
  return (
    <Box
      style={{
        //backgroundColor: "#32343a",
        background: !props.transparent ? "#32343a" : "transparent",
        cursor: "pointer",
        borderRadius: "100%",
      }}
      {...props}
    />
  );
}

export function User({ auth }: { auth: SessionContextValue }) {
  switch (auth.status) {
    case "authenticated":
      return (
        <DarkMode>
          <ChakraMenu>
            {({ isOpen }) => (
              <>
                <MenuButton className="hover:opacity-75">
                  <HStack>
                    <Avatar transparent>
                      <Image
                        alt="User Avatar"
                        src={auth.data?.user?.image}
                        width={50}
                        style={{ borderRadius: "100%" }}
                      />
                    </Avatar>
                    {isOpen ? (
                      <UpIcon className="w-5 inline" />
                    ) : (
                      <DownIcon className="w-5 inline" />
                    )}
                  </HStack>
                </MenuButton>
                <MenuList bgColor="#1e1f22">
                  <NextLink href="/dashboard">
                    <MenuItem>My Servers</MenuItem>
                  </NextLink>
                  <NextLink href="/api/logout">
                    <MenuItem className="!text-red-500">Logout</MenuItem>
                  </NextLink>
                </MenuList>
              </>
            )}
          </ChakraMenu>
        </DarkMode>
      );
    case "loading":
      return (
        <Avatar>
          <Spinner color={Configuration.Color} size="xs" p={0} />
        </Avatar>
      );
    case "unauthenticated":
      return (
        <Avatar onClick={() => signIn("discord")} p={2}>
          <Icons.Member size={35} />
        </Avatar>
      );
  }
}

export function Menu(props: MenuProps) {
  const session = useSession();
  const { isMobile } = useWindowSize();
  const Component = isMobile ? AutoCenter : Center;
  return (
    <Center>
      <div className={`${isMobile ? "" : "pr-5 pt-5"} z-50`}>
        <Component>
          <NextLink
            style={BrandColor}
            className={`${
              isMobile ? "pb-1" : "!inline"
            } font-bold text-2xl pr-6 hover:opacity-80`}
            href="/"
          >
            {Configuration.Title}
          </NextLink>
          <div className="pr-6">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div className={`${isMobile ? "pt-1" : ""} !float-right !inline`}>
            <User auth={session} />
          </div>
        </Component>
      </div>
    </Center>
  );
}
