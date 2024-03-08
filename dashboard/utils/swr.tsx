import useSWR, { SWRResponse, BareFetcher, SWRConfiguration } from "swr";
import { Routes } from "./api-types";
import { config } from "./config";
import fetch, { AxiosResponse } from "axios";
import { Methods } from "./api";
import { Box, Code, VStack } from "@chakra-ui/react";
import ErrorMessage from "../components/ErrorMessage";
import { DownIcon, UpIcon } from "../components/oldIcons";
import { useState } from "react";

export interface useFetchOptions extends SWRConfiguration {
  method?: Methods;
  route: Routes | string;
  fullURL?: string;
  body?: object;
}

export class SWRManager {
  private privateKey: string = config.apiToken;
  private url: string = config.apiUri;

  constructor(privateKey: string, url: string) {
    this.privateKey = privateKey;
    this.url = url;
  }

  private createFetcher(method?: Methods, body?: object) {
    return async (input: string) => {
      let res: AxiosResponse<any, any>;
      try {
        res = await fetch.get(input, {
          method: (method ?? Methods.Get) as string,
          data: body == null ? null : JSON.stringify(body),
          headers: {
            Authorization: this.privateKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (res.data.error == true && res.status == 404) {
          const error = new Error("Not Found");
          //@ts-expect-error
          error.info = await res.data;
          //@ts-expect-error
          error.status = res.data.status;
          throw error;
        }

        if (res.data.error == true && res.status == 400) {
          const error = new Error("Bad Request");
          //@ts-expect-error
          error.info = await res.data;
          //@ts-expect-error
          error.status = res.data.status;
          throw error;
        }

        if (res.data.error == true && res.status == 500) {
          const error = new Error("Internal Server Error");
          //@ts-expect-error
          error.info = await res.data;
          //@ts-expect-error
          error.status = res.data.status;
          throw error;
        }

        return res.data;
      } catch (e) {
        console.log(JSON.stringify(res));
        throw e;
      }
    };
  }

  useFetch<T>(options: useFetchOptions): SWRResponse<T> {
    return useSWR(
      options?.fullURL ?? this.url + options.route,
      this.createFetcher(options.method, options.body),
      options
    );
  }

  Error({ response }: { response: SWRResponse<any, any, any> }) {
    const [expanded, expand] = useState(false);
    return (
      response.error && (
        <VStack pt={2}>
          <ErrorMessage>
            Something went wrong, try again in a few minutes.
          </ErrorMessage>
          <Box
            cursor="pointer"
            onClick={() => expand(!expanded)}
            className="hover:opacity-80"
          >
            {expanded ? "Less" : "More"} Details{" "}
            {expanded ? <UpIcon /> : <DownIcon />}
          </Box>
          {expanded && (
            <Box pb={5} pt={3}>
              <Code
                p={5}
                mx={20}
                overflow="hidden"
                backgroundColor="#2f3136"
                textColor="white"
                borderColor="#202225"
                borderWidth={1.3}
                borderRadius="md"
                lang="js"
              >
                {JSON.stringify(response.error)}
                {/* {isCopied ?
                                <CheckIcon color='#248045' /> :
                                <CopyIcon color={Configuration.Color} onClick={() => {
                                    Clipboard.onCopy();
                                    setCopy(true);
                                }} />
                            } */}
              </Code>
            </Box>
          )}
        </VStack>
      )
    );
  }
}
