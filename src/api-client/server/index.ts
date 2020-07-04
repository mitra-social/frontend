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
import { ActorExtended } from "@/store/modules/actor-extended";

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
    page: number
  ): Promise<OrderedCollectionPage> {
    return await axios
      .get(`${urlPrefix}/user/${user}/inbox?page=${page}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // eslint - disable - next - line
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
  // Fediverse
  async findActor(query: string): Promise<ActorExtended | undefined> {
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

        if (link) {
          return this.getActorExtended(link.href);
        }
        return;
      });
  },
  async getActor(url: string): Promise<Actor> {
    return await axios
      .get(url, {
        headers: {
          Accept: "application/activity+json",
        },
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => console.log(err));
  },
  async getActorExtended(url: string): Promise<ActorExtended> {
    return await axios
      .get(url, {
        headers: {
          Accept: "application/activity+json",
        },
      })
      .then((resp) => {
        const user: User = resp.data;
        console.log(user);
        return this.getFediversCollection(`${user.following}?page=1`).then(
          (collectionFollowing) => {
            return this.getFediversCollection(`${user.followers}?page=1`).then(
              (collectionFollowers) => {
                console.log(collectionFollowers);
                console.log(collectionFollowers);
                return {
                  type: user.type,
                  id: user.userId,
                  name: user.name,
                  summary: user.summary,
                  preferredUsername: user.preferredUsername,
                  followingIds: collectionFollowing.orderedItems,
                  followingCount: collectionFollowing.totalItems,
                  followersIds: collectionFollowers.orderedItems,
                  followerCount: collectionFollowers.totalItems,
                };
              }
            );
          }
        );
        return resp.data;
      });
  },
  async getFediversCollection(url: string): Promise<OrderedCollectionPage> {
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
