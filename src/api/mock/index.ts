import { OrderedCollectionPage } from "activitypub-objects";

import { ApiClient } from "@/api/api-client";
import { Credential } from "@/model/credential";

import * as collection from "./data/collection.json";

// eslint-disable-next-line
const fetch = (mockData: any, time = 0): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
};

const USER_NAME = "john.doe";
const USER_PWD = "123";
const USER_TOKEN = "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi"

export default {
  login(credential: Credential): Promise<string> {
    if (credential.username !== USER_NAME || credential.password !== USER_PWD) {
      return Promise.reject(new Error("Login failed"));
    }
    return fetch(USER_TOKEN, 1000);
  },
  fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage> {
    console.info(`token: ${token}, user: ${user}, page: ${page}`);
    if (token !== USER_TOKEN || user !== USER_NAME) {
      return Promise.reject(new Error("Not allowed"));
    }
    return fetch(collection.default, 1000);
  }
} as ApiClient;
