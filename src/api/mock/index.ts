import * as articles from "./data/article-collection.json";

const fetch = (mockData, time = 0) => {
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
