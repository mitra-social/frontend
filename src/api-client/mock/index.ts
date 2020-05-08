import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON,
  Actor
} from "activitypub-objects";

import { ApiClient } from "@/api-client";
import { User } from "@/model/user";
import { Credential } from "@/model/credential";

import * as userData from "./data/user.json";
import * as actorsData from "./data/actors.json";
import * as follwoingData from "./data/following.json";
import * as collectionData from "./data/collection.json";
import { Activity } from "@/model/mitra-activity";

const USER_NAME = "john.doe";
const USER_PWD = "123";
const USER_TOKEN = "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi";

// eslint-disable-next-line
const fetch = (mockData: any): Promise<any> => {
  return new Promise(resolve => {
    resolve(mockData);
  });
};

// eslint-disable-next-line
const error = (msg: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    reject(new Error(msg));
  });
};

const returnResult = async (
  token: string,
  user: string,
  // eslint-disable-next-line
  promis: Promise<any>
) => {
  if (token !== USER_TOKEN || user !== USER_NAME) {
    return await error("Authentication is incorrect");
  }

  return promis;
};

export default {
  async login(credential: Credential): Promise<string> {
    if (credential.username !== USER_NAME || credential.password !== USER_PWD) {
      return await error("Login failed");
    }
    return await fetch(USER_TOKEN);
  },
  async getUser(token: string, user: string): Promise<User> {
    console.info(`token: ${token}, user: ${user}`);

    return returnResult(token, user, fetch(userData.default)) as Promise<User>;
  },
  async getActor(url: string): Promise<Actor> {
    console.info(`url: ${url}`);
    const actors = actorsData.default;
    return await fetch(actors[1]) as Promise<Actor>;
  },
  async fetchFollowing(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage> {
    console.info(`token: ${token}, user: ${user}, page: ${page}`);
    return returnResult(token, user, fetch(follwoingData.default)) as Promise<
      CollectionPage
    >;
  },
  async fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage> {
    console.info(`token: ${token}, user: ${user}, page: ${page}`);
    return returnResult(token, user, fetch(collectionData.default)) as Promise<
      OrderedCollectionPage
    >;
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
    return returnResult(token, user, {} as Promise<void>);
  }
} as ApiClient;
