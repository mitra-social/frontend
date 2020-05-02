import axios from "axios";
import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON
} from "activitypub-objects";

import { ApiClient } from "@/api-client";
import { Credential } from "@/model/credential";
import { User } from "@/model/user";
import { ActivityImplementation } from "@/model/mitra-activity";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

export default {
  async login(credential: Credential): Promise<string> {
    return await axios.post("/token", credential, config).then(resp => {
      return resp.data.token;
    });
  },
  async getUser(token: string, user: string): Promise<User> {
    return await axios
      .get(`/user/${user}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => {
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
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => {
        console.log(resp);
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
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => {
        return resp.data;
      });
  },
  async writeToOutbox(
    token: string,
    user: string,
    activity: ActivityImplementation,
    summary?: string
  ): Promise<void> {
    if (summary) {
      activity.summary = summary;
    }
    console.info(
      `token: ${token}, user: ${user}, activity: ${toJSON(activity)}`
    );
    return await axios.post(`/user/${user}/outbox`, toJSON(activity), {
      headers: {
        "Content-Type": "application/activity+json",
        Authorization: `Bearer ${token}`
      }
    });
  }
} as ApiClient;
