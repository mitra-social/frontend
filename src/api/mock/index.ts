import { OrderedCollectionPage } from "activitypub-objects";

import { ApiClient } from "@/api/api-client";
import { User } from "@/model/user";
import { Credential } from "@/model/credential";

import * as userData from "./data/user.json";
import * as collectionData from "./data/collection.json";

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

const USER_NAME = "john.doe";
const USER_PWD = "123";
const USER_TOKEN = "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi";

export default {
  async login(credential: Credential): Promise<string> {
    if (credential.username !== USER_NAME || credential.password !== USER_PWD) {
      return await error("Login failed");
    }
    return await fetch(USER_TOKEN);
  },
  async getUser(token: string, user: string): Promise<User> {
    console.info(`token: ${token}, user: ${user}`);
    if (user !== USER_NAME) {
      return await error("Authentication is incorrect");
    }
    return await fetch(userData.default);
  },
  async fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage> {
    console.info(`token: ${token}, user: ${user}, page: ${page}`);
    if (user !== USER_NAME) {
      return await error("Authentication is incorrect");
    }
    return await fetch(collectionData.default);
  }
} as ApiClient;
