import axios from "axios";
import {
  OrderedCollectionPage,
  OrderedCollection,
  toJSON
} from "activitypub-objects";
import { Activity } from "activitypub-objects/dst/activities/activity";

import { ApiClient } from "@/api-client";
import { Credential } from "@/model/credential";
import { User } from "@/model/user";

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
    user: string
  ): Promise<OrderedCollection> {
    console.info(`token: ${token}, user: ${user}`);
    return await axios
      .get(`/user/${user}/following`, {
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
    activity: Activity,
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
