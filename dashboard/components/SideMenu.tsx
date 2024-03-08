import {
  Button,
  Center,
  HStack,
  Heading,
  Text,
  TextProps,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Configuration } from "../pages/_app";
import { APIGuild } from "../utils/types";
import { AutoCenter } from "./Layout/AutoCenter";
import { BrandColor } from "./Utils/Link";
import { RobotIcon } from "./Robot";
import { LighterText } from "../utils/styles";
import { Autocomplete } from "@primer/react";
import Link from "next/link";
import { Image } from "./Image";
import { SWRResponse } from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function MenuItem({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: string;
}) {
  return (
    <a href={href}>
      {/* <div className='px-2 py-2 MenuItem rounded-md font-medium'>
                <Center>
                    {children}
                </Center>
            </div> */}
      <Button
        variant="MenuItem"
        width="15rem"
        height="3rem"
        className="my-1 py-2"
        //leftIcon={<Image src={icon} width={25} />}
      >
        {children}
      </Button>
    </a>
  );
}

export function Item(props: TextProps) {
  return (
    <>
      <Text {...props} fontSize={17} fontWeight="medium" />
    </>
  );
}

export function SideMenu({
  GuildId,
  GuildName,
  Guilds,
}: {
  GuildName: string;
  Guilds: SWRResponse<APIGuild[], any, any>;
  GuildId: string;
}) {
  const { data, status } = useSession();
  const router = useRouter();
  if (status != "authenticated") return <div></div>;
  return (
    <div className="SideMenu overflow-hidden !w-[18rem] px-8 py-5 overflow-y-auto border-r border-r-[#33353b] mr-10">
      <Center>
        <a href="/">
          <div className="mb-5 hover:opacity-80">
            {/* <img src={Configuration.Icon.SVG} className="w-8 ml- mt-  inline-block mr-2" /> */}
            <HStack>
              <RobotIcon
                height="3rem"
                width="3rem"
                fill={Configuration.Color}
              />
              <VStack pl={5} textAlign="left">
                <Heading size="md" style={BrandColor}>
                  Beep Boop
                </Heading>
                <Text style={LighterText}>Dashboard</Text>
              </VStack>
            </HStack>
          </div>
        </a>
      </Center>
      <Center>
        <Link
          href="/dashboard"
          className="text-[1.150rem] font-medium hover:opacity-80"
        >
          <img src="/Icons/Return.svg" className="inline" /> Change Server
        </Link>
        <Autocomplete>
          <Autocomplete.Input />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              selectedItemIds={[]}
              items={
                !Array.isArray(Guilds?.data)
                  ? []
                  : Guilds.data.map((e) => ({
                      text: e.Name,
                      id: e.Id,
                    }))
              }
              onSelectedChange={(data) => {
                router.push(`/dashboard/${data[0].id}`);
              }}
              aria-labelledby="autocompleteLabel"
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </Center>
      <AutoCenter className="pt-2">
        <HStack>
          <VStack>
            <Image width={25} src="/Icons/Settings.svg" />
            <Image width={25} src="/Icons/Clipboard.svg" />
            <Image width={25} src="/Icons/Ticket.svg" />
            <Image width={25} src="/Icons/Reward.svg" />
          </VStack>
          <VStack>
            <Item>Dashboard</Item>
            <Item>Appeals</Item>
            <Item>Tickets</Item>
            <Item>Levels</Item>
            {/* <MenuItem icon='/Icons/Settings.svg' href={`/dashboard/${GuildId}/`}>Dashboard</MenuItem>
                        <MenuItem icon='/Icons/Clipboard.svg' href={`/dashboard/${GuildId}/appeals`}>Appeal Settings</MenuItem>
                        <MenuItem icon='/Icons/Ticket.svg' href={`/dashboard/${GuildId}/tickets`}>Tickets</MenuItem>
                        <MenuItem icon='/Icons/Reward.svg' href={`/dashboard/${GuildId}/tickets`}>Levels</MenuItem> */}
          </VStack>
        </HStack>
      </AutoCenter>
    </div>
  );
}
