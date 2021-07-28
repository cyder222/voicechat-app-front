import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVoiceChatApi } from "../../../api-fetch/index";
import { User } from "../../../codegen/api/fetch";

export interface fetchUserPayload{
  user: User;
}
export const asyncFetchCurrentUser = createAsyncThunk<fetchUserPayload, string>(
  "db/user/asyncFetchUser",
  async (apiKey: string): Promise<fetchUserPayload> => {
    const api = getVoiceChatApi(apiKey);
    const user = await api.getUsersCurrent();

    return { user: user };
  },
);
