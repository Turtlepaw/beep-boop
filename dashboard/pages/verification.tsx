import { GetServerSideProps } from "next";
import { ExternalIcon, Menu } from "../components/Layout/Menu";
import { DefaultProps, parseUser } from "../utils/parse-user";
import { Meta } from "../components/Meta";
import { Box, Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { Link, NextLink } from "../components/Utils/Link";
import {
  Checkmark20Filled,
  Info16Filled,
  Info20Filled,
  Info24Filled,
} from "@fluentui/react-icons";
import { Configuration } from "../utils/configuration";
import { LightText, LighterText } from "../utils/styles";
import { Image } from "../components/Image";

export default function Home(props: DefaultProps) {
  return (
    <>
      <Menu {...props} />
      <Meta>Verification</Meta>
      <Box pb={10}>
        <VStack>
          <VStack>
            <Heading style={LighterText} size="sm">
              Introducing
            </Heading>
            <Heading>
              <Image
                style={{ display: "inline-block" }}
                src="/VerifiedGreen.svg"
                width={45}
              />
              Verified Users
            </Heading>
          </VStack>
          <Text style={LightText}>
            <Box display="inline" pr={1}>
              <Checkmark20Filled color={Configuration.Color} />
            </Box>
            Get verified faster with a{" "}
            <Link isExternal href="/pricing">
              pro or basic subscriptions
            </Link>
          </Text>
          <Box pt={2}>
            <NextLink href="/support">
              <Button rightIcon={<ExternalIcon />}>Get Verified</Button>
            </NextLink>
          </Box>
        </VStack>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<DefaultProps> =
  async function (ctx) {
    const user = await parseUser(ctx);
    return {
      props: {
        user,
        mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
      },
    };
  };
