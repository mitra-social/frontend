import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON,
  ActivityObject
} from "activitypub-objects";

import { ApiClient } from "@/api-client";
import { User } from "@/model/user";
import { Credential } from "@/model/credential";
import { Activity } from "@/model/mitra-activity";
import { CreateUser } from "@/model/create-user";

import * as userData from "./data/user.json";
import * as createUserData from "./data/create-user.json";
import * as follwoingData from "./data/following.json";
import * as collectionData from "./data/collection.json";

const USER_NAME = "john.doe";
const USER_EMAIL = "john.doe@mail.com";
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
  async createUser(user: CreateUser) {
    console.info(
      `name: ${user.username}, email: ${user.email}, pwd: ${user.password}`
    );
    if (user.username === USER_NAME) {
      return await error("User exists!");
    }

    if (user.email === USER_EMAIL) {
      return await error("Email exists!");
    }

    return await fetch(createUserData.default);
  },
  async getUser(token: string, user: string): Promise<User> {
    console.info(`token: ${token}, user: ${user}`);

    return returnResult(token, user, fetch(userData.default)) as Promise<User>;
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
      `token: ${token}, user: ${user}, activity: ${toJSON(
        activity as ActivityObject
      )}`
    );
    return returnResult(token, user, {} as Promise<void>);
  }
} as ApiClient;
