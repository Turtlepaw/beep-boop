import { Button, Center, Spinner } from "@chakra-ui/react";
import { AutoCenter } from "./Layout/AutoCenter";
import { Meta } from "./Meta";
import { Image, Images } from "./Image";
import { Link, NextLink } from "./Utils/Link";
import { DefaultProps, DeprecatedDefaultProps } from "../utils/parse-user";
import { Menu } from "./Layout/Menu";
import { signIn } from "next-auth/react";
import { signInWithDiscord } from "../utils/auth";

export function NotLoggedIn(props?: DeprecatedDefaultProps) {
  return (
    <>
      <Menu />
      <Meta>Not Logged In</Meta>
      <div className="py-20">
        <AutoCenter>
          <Center>
            <Image
              className="mr-2"
              src="https://raw.githubusercontent.com/Turtlepaw/fluent-emojis/master/Emojis/Smilies/Crying%20Face.png"
              alt="Sad Face"
              width={30}
            />
            <h1 className="font-semibold text-2xl">You're not logged in!</h1>
          </Center>
          <p className="font-medium max-w-sm text-center text-lg pt-1">
            You need to log in with your{" "}
            <Link href="/api/oauth" isExternal onBrand={false}>
              <b className="font-semibold">
                <Images.Discord className="inline" /> Discord
              </b>{" "}
              account
            </Link>{" "}
            to access this page.
          </p>
          <Center className="pt-5">
            <Button
              onClick={() => signInWithDiscord()}
              variant="primary"
              leftIcon={
                <Image
                  width={25}
                  src="/Icons/PersonLogin.svg"
                  alt="Login Icon"
                />
              }
              className="inline"
            >
              Login
            </Button>
            <NextLink className="inline px-1.5" href="/">
              <Button
                variant="secondary"
                leftIcon={
                  <Image
                    width={25}
                    src="/Icons/Return.svg"
                    alt="Return back home"
                  />
                }
                className="inline"
              >
                Back Home
              </Button>
            </NextLink>
          </Center>
        </AutoCenter>
      </div>
    </>
  );
}

export function AuthenticationLoading(props: DefaultProps) {
  return (
    <>
      <Menu {...props} />
      <Meta>Loading</Meta>
      <div className="py-20">
        <AutoCenter>
          <Spinner />
        </AutoCenter>
      </div>
    </>
  );
}
