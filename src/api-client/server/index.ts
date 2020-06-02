import axios from "axios";
import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON,
  ActivityObject,
  Actor,
  Activity,
} from "activitypub-objects";

import { ApiClient } from "@/api-client";
import { Credential } from "@/model/credential";
import { User } from "@/model/user";
import { CreateUser } from "@/model/create-user";

const urlPrefix = process.env.NODE_ENV === "production" ? "/api" : "";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default {
  async login(credential: Credential): Promise<string> {
    return await axios
      .post(`${urlPrefix}/token`, credential, config)
      .then((resp) => {
        return resp.data.token;
      });
  },
  async createUser(user: CreateUser) {
    return await axios.post(`${urlPrefix}/user`, user, config);
  },
  async getUser(token: string, user: string): Promise<User> {
    return await axios
      .get(`${urlPrefix}/user/${user}`, {
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
  async getActor(url: string): Promise<Actor> {
    return await axios
      .get(url, {
        headers: {
          Accept: "application/activity+json",
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
    return await axios
      .get(`${urlPrefix}/user/${user}/following?page=${page}`, {
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
      .get(`${urlPrefix}/user/${user}/inbox?page=${page}`, {
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
    return await axios.post(
      `${urlPrefix}/user/${user}/outbox`,
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
