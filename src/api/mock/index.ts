import * as articles from "./data/article-collection.json";

// TODO: set type
const fetch = (mockData: any, time = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
};

export default {
  fetchPosts() {
    return fetch(articles, 1000); // wait 1s before returning posts
  }
};
