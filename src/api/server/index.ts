import axios from "axios";
import { OrderedCollectionPage } from "activitypub-objects";

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
  fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage> {
    return axios
      .get(`/user/${user}/inbox?page=${page}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => {
        return resp.data;
      });
  }
} as ApiClient;
