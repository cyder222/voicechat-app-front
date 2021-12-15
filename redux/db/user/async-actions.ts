import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVoiceChatApi } from "../../../api-fetch/index";
import { GetApiUsersUserIdRequest, PublicUser, User } from "../../../codegen/api/fetch";

export interface fetchPublicUserPayload {
  user: PublicUser;
}

export interface fetchUserPayload {
  user: User;
}

export const asyncFetchCurrentUser = createAsyncThunk<fetchUserPayload, { apiKey: string }>(
  "db/user/asyncFetchUser",
  async ({ apiKey }): Promise<fetchUserPayload> => {
    const api = getVoiceChatApi(apiKey);
    const user = await api.getUsersCurrent();

    return { user: user };
  },
);

type fixGetApiUsersUserIdRequest = { apiKey: string } & GetApiUsersUserIdRequest;

export const asyncFetchUserByUserId = createAsyncThunk<fetchPublicUserPayload, fixGetApiUsersUserIdRequest>(
  "db/user/asyncFetchUser",
  async (payload): Promise<fetchPublicUserPayload> => {
    const api = getVoiceChatApi(payload.apiKey);
    const user = await api.getApiUsersUserId(payload);

    return { user: user };
  },
);
