import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON,
  ActivityObject,
  Actor,
  Activity,
} from "activitypub-objects";

import { User } from "@/model/user";
import { Credential } from "@/model/credential";
import { CreateUser } from "@/model/create-user";

import * as userData from "./data/user.json";
import * as createUserData from "./data/create-user.json";
import * as actorsData from "./data/actors.json";
import * as followingData from "./data/following.json";
import * as followerData from "./data/followers.json";
import * as collectionPageOneData from "./data/collection-page-1.json";
import * as collectionPageTwoData from "./data/collection-page-2.json";
import * as collectionSecondFetchData from "./data/collection-second-fetch.json";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

/*
 constant variables
 */
const USER_NAME = "john.doe";
const USER_EMAIL = "john.doe@mail.com";
const USER_PWD = "123";
const USER_TOKEN = "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi";
const NEXT_PAGE_DELAY = 5000;

/*
 variables
 */
let fetchPostCount = 0;
let following: CollectionPage | undefined;
let followers: CollectionPage | undefined;

/*
    helper function
 */
// eslint-disable-next-line
const fetch = (mockData: any | any[]): Promise<any> => {
  return new Promise((resolve) => {
    resolve(mockData);
  });
};

// eslint-disable-next-line
const error = (msg: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    reject(new Error(msg));
  });
};

const returnResult = async (
  token: string,
  user: string,
  // eslint-disable-next-line
  promis: Promise<any>
) => {
  if (token !== USER_TOKEN || user !== USER_NAME) {
    return await error("Authentication is incorrect");
  }

  return promis;
};

const delay = async (ms: number) => {
  return await new Promise((resolve) => {
    if (process.env.NODE_ENV === "test") {
      jest.useFakeTimers();
    }
    setTimeout(resolve, ms);
    if (process.env.NODE_ENV === "test") {
      jest.runAllTimers();
    }
  });
};

export default {
  async login(credential: Credential): Promise<string> {
    if (credential.username !== USER_NAME || credential.password !== USER_PWD) {
      return await error("Login failed");
    }
    return await fetch(USER_TOKEN);
  },
  async createUser(user: CreateUser) {
    console.info(
      `createUser => name: ${user.username}, email: ${user.email}, pwd: ${user.password}`
    );
    if (user.username === USER_NAME) {
      return await error("User already exists!");
    }

    if (user.email === USER_EMAIL) {
      return await error("This e-mail is already linked to an user.");
    }

    return await fetch(createUserData.default);
  },
  async getUser(token: string, user: string): Promise<User> {
    console.info(`getUser => token: ${token}, user: ${user}`);

    return returnResult(token, user, fetch(userData.default)) as Promise<User>;
  },
  async findActor(query: string): Promise<Actor | undefined> {
    // TODO:
    // const actors = [this.getActor("https://mastodon.social/users/fraenki")]
    console.info(`findActor => query: ${query}`);
    return fetch(this.getActor("https://mastodon.social/users/fraenki"));
  },
  async getActor(url: string): Promise<Actor> {
    console.info(`getActor => url: ${url}`);
    // eslint-disable-next-line
    const actors = actorsData.default as any;
    const actor = (actors as Actor[]).find(
      ($) => $ && $.id?.toString() === url
    );
    return (await fetch(actor)) as Promise<Actor>;
  },
  async fetchFollowing(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage> {
    console.info(
      `fetchFollowing => token: ${token}, user: ${user}, page: ${page}`
    );

    if (!following) {
      // eslint-disable-next-line
      following = (followingData.default as any) as CollectionPage;
    }

    return returnResult(token, user, fetch(following)) as Promise<
      CollectionPage
    >;
  },
  async fetchFollowers(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage> {
    console.info(
      `fetchFollowers => token: ${token}, user: ${user}, page: ${page}`
    );

    if (!followers) {
      // eslint-disable-next-line
      followers = (followerData.default as any) as CollectionPage;
    }
    return returnResult(token, user, fetch(followers)) as Promise<
      CollectionPage
    >;
  },
  async fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage> {
    let data = fetch(collectionPageOneData.default);
    fetchPostCount++;
    console.info(
      `fetchPosts => fetch count: ${fetchPostCount}, token: ${token}, user: ${user}, page: ${page}`
    );

    if (fetchPostCount > 1) {
      data = fetch(collectionSecondFetchData.default);
      fetchPostCount = 0;
    }

    if (page === 1) {
      data = fetch(collectionPageTwoData.default);
      await delay(NEXT_PAGE_DELAY);
    }

    if (page === 2) {
      return await error("Not found");
    }
    return returnResult(token, user, data) as Promise<OrderedCollectionPage>;
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
    console.info(
      `writeToOutbox => token: ${token}, user: ${user}, activity: ${toJSON(
        activity
      )}`
    );

    if (following && activity.type == "Follow") {
      // eslint-disable-next-line
      const actors = actorsData.default as any;
      const actor = (actors as User[]).find(
        ($) => $.id?.toString() === activity.to
      );

      following.items.push(actor as ActivityObject);
    }

    if (
      following &&
      activity.type === "Undo" &&
      (activity.object as ActivityObject).type === "Follow"
    ) {
      following.items = following.items.filter(
        ($) => ActivityObjectHelper.extractId($) !== activity.to
      );
    }

    return returnResult(token, user, {} as Promise<void>);
  },
  getMedia(uri: string | undefined): string | undefined {
    console.info(`getMedia => uri: ${uri}`);
    return uri;
  },
  updateUser(token: string, user: User): Promise<void> {
    console.info(
      `updateProfile => token: ${token}, preferredUsername: ${user.preferredUsername}, email: ${user.email}`
    );
    // TODO: implements
    return Promise.reject("not implemented yet");
  },
  updatePassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    console.info(
      `updatePassword => token: ${token}, oldPassword: ${oldPassword}, newPassword: ${newPassword}`
    );
    // TODO: implements
    return Promise.reject("not implemented yet");
  },
  // Fediverse
  async fediverseSearchUserId(query: string): Promise<string | undefined> {
    console.info(`fediverseSearchUserId => query: ${query}`);
    // TODO: implements
    return Promise.reject("not implemented yet");
  },
  async fediverseGetActor(url: string): Promise<Actor> {
    console.info(`fediverseGetActor => url: ${url}`);
    // eslint-disable-next-line
    const actors = actorsData.default as any;
    const actor = (actors as User[]).find(($) => $.id?.toString() === url);

    if (!actor) {
      return Promise.reject("No actor found.");
    }

    return fetch(actor);
  },
  async fediverseGetUser(url: string): Promise<User> {
    console.info(`updatePassword => url: ${url}`);
    // TODO: implements
    return Promise.reject("not implemented yet");
  },
  async fediversGetCollection(url: string): Promise<OrderedCollectionPage> {
    console.info(`fediversGetCollection => url: ${url}`);
    // TODO: implements

    return Promise.reject("not implemented yet");
  },
  // jest function
  getJestReset: () => {
    if (process.env.NODE_ENV === "test") {
      console.info(
        `getJestReset => fetchPostCount: ${fetchPostCount}, fetchFollowing: ${
        following ? toJSON(following) : ""
        }, fetchFollowers: ${followers ? toJSON(followers) : ""}`
      );
      return jest.fn().mockImplementation(() => {
        fetchPostCount = 0;
        following = undefined;
        followers = undefined;
      });
    }
  },
};
