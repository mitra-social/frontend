import { OrderedCollection } from "activitypub-objects";

import { ApiClient } from "@/api/api-client";
import { Credential } from "@/model/credential";

import * as articles from "./data/article-collection.json";

// eslint-disable-next-line
const fetch = (mockData: any, time = 0): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
};

export default {
  login(credential: Credential): Promise<string> {
    const userName = "johnny.do@mail.ch";

    if (credential.username !== userName || credential.password !== "123") {
      return Promise.reject(new Error("Login failed"));
    }
    return fetch("5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi", 1000);
  },
  fetchPosts(): Promise<OrderedCollection> {
    return fetch(articles, 1000);
  }
} as ApiClient;
