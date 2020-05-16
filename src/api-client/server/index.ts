import axios from "axios";
import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON,
  ActivityObject,
} from "activitypub-objects";

import { ApiClient } from "@/api-client";
import { Credential } from "@/model/credential";
import { User } from "@/model/user";
import { Activity } from "@/model/mitra-activity";
import { CreateUser } from "@/model/create-user";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default {
  async login(credential: Credential): Promise<string> {
    return await axios.post("/token", credential, config).then((resp) => {
      return resp.data.token;
    });
  },
  async createUser(user: CreateUser) {
    return await axios.post("/user", user, config);
  },
  async getUser(token: string, user: string): Promise<User> {
    return await axios
      .get(`/user/${user}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async fetchFollowing(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage> {
    console.info(`token: ${token}, user: ${user}, page: ${page}`);
    return await axios
      .get(`/user/${user}/following?page=${page}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage> {
    return await axios
      .get(`/user/${user}/inbox?page=${page}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // eslint - disable - next - line
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async writeToOutbox(
    token: string,
    user: string,
    activity: Activity,
    summary?: string
  ): Promise<void> {
    if (summary) {
      activity.summary = summary;
    }
    console.info(
      `token: ${token}, user: ${user}, activity: ${toJSON(
        activity as ActivityObject
      )}`
    );
    return await axios.post(
      `/user/${user}/outbox`,
      toJSON(activity as ActivityObject),
      {
        headers: {
          "Content-Type": "application/activity+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
} as ApiClient;
