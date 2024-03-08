import {
  Box,
  Center,
  Code,
  HStack,
  Heading,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { AutoCenter } from "../../../components/Layout/AutoCenter";
import { ExternalIcon } from "../../../components/Layout/Menu";
import { SideMenu } from "../../../components/SideMenu";
import { CreateHandler } from "../../../utils/utils";
import { Permissions } from "../../../utils/permissions";
import { Meta } from "../../../components/Meta";
import { NotLoggedIn } from "../../../components/User";
import { SaveAlert } from "../../../components/SaveAlert";
import { useSession } from "next-auth/react";
import { SWRManager } from "../../../utils/swr";
import { config } from "../../../utils/config";
import { APIGuild } from "../../../utils/types";
import { useRouter } from "next/router";
import { Codeblock } from "../../../components/Codeblock";

export interface Props {
  apiUri: string;
  privateKey: string;
}

export function Card(props: { children: React.ReactNode; href: string }) {
  return (
    <Center>
      <a className="card ActiveCard" href={props.href}>
        <Center className="px-20 py-4">
          <div className="inline">{props.children}</div>
          <div className="pl-2">
            <ExternalIcon />
          </div>
        </Center>
      </a>
    </Center>
  );
}

export function Title({ children }: { children: string }) {
  return (
    <Heading fontSize={17} textTransform="uppercase" fontWeight="semibold">
      {children}
    </Heading>
  );
}

export default function Home(props: Props) {
  const { data, status } = useSession();
  const { query } = useRouter();
  const swr = new SWRManager(props.privateKey, props.apiUri);
  // /users/@me/guilds
  let guilds = swr.useFetch<APIGuild[]>({
    fullURL: `${props.apiUri}/v1/guilds?id=${data?.user?.id}`,
    route: null,
  });
  const guild = Array.isArray(guilds.data)
    ? guilds.data.find((e) => e.Id == query.Id)
    : null;

  const [SavePanel, SetPanel] = useState(false);
  const [IsSaving, SetSaving] = useState(false);
  const [Channel, SetChannel] = useState("");
  const [blockInvites, setBlockInvites] = useState(false);
  const [oldBlockInvites, setOldBlockInvites] = useState(false);
  const HandleChannel = CreateHandler(Channel, SetChannel, () =>
    SetPanel(true)
  );
  const SaveSettings = async () => {
    //SetAppeals(guild.Id, Channel)
  };
  const SaveAll = () => {
    SetSaving(!IsSaving);
  };
  const TogglePanel = () => SetPanel(!SavePanel);
  const handle = (
    older: boolean | string,
    setter: React.Dispatch<React.SetStateAction<boolean | string>>,
    type: "bool" | "string" = "bool",
    currentValue: string | boolean,
    newValue?: string
  ) => {
    if (
      (type == "string" && older == newValue) ||
      (type == "bool" && older == currentValue)
    )
      SetPanel(true);
    else SetPanel(false);

    if (type == "string") {
      setter(newValue);
    } else if (type == "bool") {
      setter(!currentValue as boolean);
    }
  };

  if (status != "authenticated") return <NotLoggedIn />;

  return (
    <>
      {/* <Menu user={props.user} isDashboard mobile={props.mobile} /> */}
      <Meta>Dashboard</Meta>
      <div className="!flex">
        <SideMenu GuildName={guild?.Name} Guilds={guilds} GuildId={guild?.Id} />
        <AutoCenter className="text-center">
          <Box
            backgroundColor="#202225"
            px={8}
            py={4}
            mb={4}
            mt={6}
            borderRadius="lg"
          >
            <Center>
              <img src={guild?.IconURL || ""} className="rounded-full w-16" />
            </Center>
            <h1 className="font-bold text-4xl pt-5 pb-3">{guild?.Name}</h1>
            <Center>
              {/* <Mentions.Role className='w-[8.6rem] font-semibold'></Mentions.Role> */}
              <Box
                backgroundColor={
                  Permissions.TypeString(guild) == "Full Access"
                    ? "#3BA55C"
                    : "yellow.500"
                }
                p="4.8px"
                mr={2}
                borderRadius="full"
              />
              {Permissions.TypeString(guild)}
            </Center>
          </Box>

          <swr.Error response={guilds} />

          <div className="card">
            <Box pt={8} px={8}>
              <Title>Server Management</Title>
              <HStack pt={2}>
                <VStack>
                  <Switch
                    onChange={() =>
                      handle(
                        oldBlockInvites,
                        setBlockInvites,
                        "bool",
                        blockInvites
                      )
                    }
                  />
                </VStack>
                <VStack>
                  <Text>Block Invite Links</Text>
                </VStack>
              </HStack>
            </Box>
            <Box pt={3} float="right" pr={4} pb={4}>
              {/* <Button
                size="sm"
                variant={ButtonStyle.BrandColor}
                onClick={() => SetPanel(true)}
                isLoading={SavePanel}
                _hover={{}}
              >
                Save
              </Button> */}
            </Box>
          </div>
          <div className="pt-5">
            <Title>Plugins</Title>
            <Card href={`${guild?.Id}/appeals`}>
              <h1>Appeal Settings</h1>
            </Card>
          </div>
        </AutoCenter>
        <SaveAlert
          Save={(next) => {
            next();
          }}
          isOpen={SavePanel}
          setOpen={SetPanel}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function () {
  return {
    props: {
      apiUri: config.apiUri,
      privateKey: config.apiToken,
    },
  };
};
