import { default as nodeFetch } from "node-fetch";
import { Configuration, ConfigurationParameters, DefaultApi } from "../codegen/api/fetch";
import { config } from "../config/constants";

const configuration: ConfigurationParameters = { basePath: config.url.API_BASE_URL };
export const getVoiceChatApi = (apiKey?: string): DefaultApi => {
  if(typeof window === "undefined")
  {
    return new DefaultApi(new Configuration({ ...configuration, apiKey: `Bearer ${apiKey}`, fetchApi: nodeFetch  }));
  }else
  {
    return new DefaultApi(new Configuration({ ...configuration, apiKey: `Bearer ${apiKey}` }));
  }
};
