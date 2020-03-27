import axios from "axios";
import { OrderedCollection } from "activitypub-objects";

import { ApiClient } from "../api-client";
import { Credential } from "@/model/credential";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

export default {
  login(credential: Credential): Promise<string> {
    return axios.post("/token", credential, config).then(resp => {
      return resp.data.token;
    });
  },
  fetchPosts(): Promise<OrderedCollection> {
    console.warn("is not yet implemented");
    return new Promise(resolve => {
      resolve(undefined);
    });
  }
} as ApiClient;
