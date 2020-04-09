import axios from "axios";
import { OrderedCollectionPage } from "activitypub-objects";

import { ApiClient } from "@/api-client";
import { Credential } from "@/model/credential";
import { User } from "@/model/user";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

export default {
  async login(credential: Credential): Promise<string> {
    return await axios.post("/token", credential, config).then(resp => {
      return resp.data.token;
    });
  },
  async getUser(token: string, user: string): Promise<User> {
    return await axios
      .get(`/user/${user}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => {
        return resp.data;
      });
  },
  async fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage> {
    return await axios
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
