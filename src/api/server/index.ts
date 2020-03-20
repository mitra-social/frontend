import { OrderedCollection } from "activitypub-objects";

import { ApiClient } from "../api-client";
import { Credential } from "@/model/credential";

export default {
  login(credential: Credential): Promise<string> {
    console.log(`Credential is: ${credential.user}/${credential.password}`);
    console.warn("is not yet implemented");
    return new Promise(resolve => {
      resolve(undefined);
    });
  },
  fetchPosts(): Promise<OrderedCollection> {
    console.warn("is not yet implemented");
    return new Promise(resolve => {
      resolve(undefined);
    });
  }
} as ApiClient;
