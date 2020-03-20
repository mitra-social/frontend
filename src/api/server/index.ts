import { OrderedCollection } from "activitypub-objects";

import { ApiClient } from "../api-client";

export default {
  fetchPosts(): Promise<OrderedCollection> {
    console.warn("is not yet implemented");
    return new Promise(resolve => {
      resolve(undefined);
    });
  }
} as ApiClient;
