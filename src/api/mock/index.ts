import { ApiClient } from "@/api/api-client";
import { Collection } from "@/model/collection";

import * as articles from "./data/article-collection.json";

// eslint-disable-next-line
const fetch = (mockData: any, time = 0): Promise<Collection> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
};

export default {
  fetchPosts(): Promise<Collection> {
    return fetch(articles, 1000); // wait 1s before returning posts
  }
} as ApiClient;
