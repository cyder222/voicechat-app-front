import { Configuration, ConfigurationParameters, DefaultApi } from "../codegen/api/fetch";
import { config } from "../config/constants";

const configuration: ConfigurationParameters = { basePath: config.url.API_BASE_URL }; 
export const getVoiceChatApi = (apiKey?: string): DefaultApi => {
    return new DefaultApi(new Configuration({ ...configuration, apiKey: `Bearer ${apiKey}` }) );
};
