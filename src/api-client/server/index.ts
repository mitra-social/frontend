import axios from "axios";
import md5 from "md5";
import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON,
  ActivityObject,
  Actor,
  Activity,
} from "activitypub-objects";

import { ApiClient } from "@/api-client";
import { Credential } from "@/model/credential";
import { User } from "@/model/user";
import { CreateUser } from "@/model/create-user";
import { Webfinger } from "@/model/webfinger";

const urlPrefix = process.env.NODE_ENV === "production" ? "/api" : "";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default {
  async login(credential: Credential): Promise<string> {
    return await axios
      .post(`${urlPrefix}/token`, credential, config)
      .then((resp) => {
        return resp.data.token;
      });
  },
  async createUser(user: CreateUser) {
    return await axios.post(`${urlPrefix}/user`, user, config);
  },
  async getUser(token: string, user: string): Promise<User> {
    return await axios
      .get(`${urlPrefix}/user/${user}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async fetchFollowing(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage> {
    return await axios
      .get(`${urlPrefix}/user/${user}/following?page=${page}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async fetchFollowers(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage> {
    return await axios
      .get(`${urlPrefix}/user/${user}/follower?page=${page}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async fetchPosts(
    token: string,
    user: string,
    page: number,
    filter?: string
  ): Promise<OrderedCollectionPage> {
    const filterQuery = filter ? `?attributedTo=${filter}` : "";

    return await axios
      .get(`${urlPrefix}/user/${user}/inbox?page=${page}${filterQuery}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // eslint-disable-next-line
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async writeToOutbox(
    token: string,
    user: string,
    activity: Activity,
    summary?: string
  ): Promise<void> {
    if (summary) {
      activity.summary = summary;
    }
    return await axios.post(
      `${urlPrefix}/user/${user}/outbox`,
      toJSON(activity as ActivityObject),
      {
        headers: {
          "Content-Type": "application/activity+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getMedia(uri: string | undefined): string | undefined {
    if (!uri) {
      return uri;
    }

    return `${process.env.VUE_APP_BACKEND_URL}/media/${md5(uri)}`;
  },
  updateUser(token: string, user: string, updatedUser: User): Promise<void> {
    // TODO: implements
    return Promise.reject(
      `not implemented yet. ${token}/${user}/${updatedUser}`
    );
  },
  updatePassword(
    token: string,
    user: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    // TODO: implements
    return Promise.reject(
      `not implemented yet. ${token}/${user}/${oldPassword}/${newPassword}`
    );
  },
  // Fediverse
  async fediverseSearchUserId(query: string): Promise<string | undefined> {
    return await axios
      .get<Webfinger>(
        `https://${query.substring(
          query.indexOf("@"),
          query.length
        )}/.well-known/webfinger?resource=acct:${query}`
      )
      .then((resp) => {
        const webfinger = resp.data;
        const link = webfinger.links.find(($) => $.rel === "self");
        return link?.href;
      });
  },
  async fediverseGetActor(url: string): Promise<Actor> {
    return await axios
      .get(url, {
        headers: {
          Accept: "application/activity+json",
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
  async fediverseGetUser(url: string): Promise<User> {
    return await axios
      .get(url, {
        headers: {
          Accept: "application/activity+json",
        },
      })
      .then((resp) => resp.data);
  },
  async fediversGetCollection(url: string): Promise<OrderedCollectionPage> {
    return await axios
      .get(url, {
        headers: {
          Accept: "application/activity+json",
        },
      })
      .then((resp) => {
        return resp.data;
      });
  },
} as ApiClient;
