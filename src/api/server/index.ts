import { ApiClient } from "../api-client";
import { Collection } from "@/model/collection";
import { Credential } from "@/model/credential";

export default {
  login(credential: Credential): Promise<string> {
    console.log(`Credential is: ${credential.user}/${credential.password}`);
    console.warn("is not yet implemented");
    return new Promise(resolve => {
      resolve(undefined);
    });
  },
  fetchPosts(): Promise<Collection> {
    console.warn("is not yet implemented");
    return new Promise(resolve => {
      resolve(undefined);
    });
  }
} as ApiClient;
