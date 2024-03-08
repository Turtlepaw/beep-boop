import useSWR, { SWRResponse, BareFetcher, SWRConfiguration } from "swr";
import { Routes } from "./api-types";
import { config } from "./config";
import fetch, { AxiosResponse } from "axios";
import { Methods } from "./api";

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
}
