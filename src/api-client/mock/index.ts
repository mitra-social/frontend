import {
  OrderedCollectionPage,
  CollectionPage,
  toJSON,
  ActivityObject,
  Activity,
  Actor,
} from "activitypub-objects";

import { ApiClientMocke } from "./api-client-mock";
import { InternalActor } from "@/model/internal-actor";
import { Credential } from "@/model/credential";
import { CreateUser } from "@/model/create-user";
import { UpdateUser } from "@/model/update-user";
import { Webfinger } from "@/model/webfinger";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

import * as userData from "./data/user.json";
import * as createUserData from "./data/create-user.json";
import * as actorsData from "./data/actors.json";
import * as webfingerData from "./data/webfinger.json";
import * as followingPage1Data from "./data/following-page-1.json";
import * as followingPage2Data from "./data/following-page-2.json";
import * as followingUserData from "./data/following-user.json";
import * as followerPage1Data from "./data/followers-page-1.json";
import * as followerPage2Data from "./data/followers-page-2.json";
import * as collectionPageOneData from "./data/collection-page-1.json";
import * as collectionPageTwoData from "./data/collection-page-2.json";
import * as collectionSecondFetchData from "./data/collection-second-fetch.json";

/*
 constant variables
 */
const USER_NAME = "john.doe";
const USER_EMAIL = "john.doe@mail.com";
const USER_TOKEN = "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi";
const NEXT_PAGE_DELAY = 5000;

/*
variables
*/
let fetchPostCount = 0;
let following: CollectionPage | undefined;
let followers: CollectionPage | undefined;
let postPage = 0;
let postFilter: string | undefined = undefined;
let userPassword = "123";
let user: InternalActor | undefined;

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
  // eslint-disable-next-line
): Promise<any> => {
  if (token !== USER_TOKEN || user !== USER_NAME) {
    return await error("Authentication is incorrect");
  }

  return promis;
};

// eslint-disable-next-line
const delay = async (ms: number): Promise<any> => {
  return await new Promise((resolve) => {
    if (process.env.NODE_ENV === "test") {
      jest.useFakeTimers();
    }
    setTimeout(resolve, ms);
    if (process.env.NODE_ENV === "test") {
      jest.runOnlyPendingTimers();
    }
  });
};

export default {
  async login(credential: Credential): Promise<string> {
    if (
      credential.username !== USER_NAME ||
      credential.password !== userPassword
    ) {
      return await error("Login failed");
    }
    return await fetch(USER_TOKEN);
  },
  async createUser(user: CreateUser): Promise<void> {
    console.info(
      `createUser => name: ${user.username}, email: ${user.email}, pwd: ${user.password}`
    );
    if (user.username === USER_NAME) {
      return await error("User already exists!");
    }

    if (user.email === USER_EMAIL) {
      return await error("This e-mail is already linked to an user.");
    }

    return await fetch(createUserData);
  },
  async getUser(token: string, userName: string): Promise<InternalActor> {
    console.info(`getUser => token: ${token}, userName: ${userName}`);

    if (!user) {
      user = userData.default as InternalActor;
    }

    return returnResult(token, userName, fetch(user)) as Promise<InternalActor>;
  },
  async updateProfile(
    token: string,
    userName: string,
    updateProfile: UpdateUser
  ): Promise<InternalActor> {
    console.info(
      `updateProfile => token: ${token}, userName: ${userName}, currentPassword: ${updateProfile.currentPassword}, newPassword: ${updateProfile?.newPassword}, email: ${updateProfile?.email}`
    );

    if (token !== USER_TOKEN || userName !== USER_NAME) {
      return await error("Authentication is incorrect");
    }

    if (userPassword !== updateProfile.currentPassword) {
      return await error("Current password is incorrect");
    }

    if (updateProfile.newPassword && updateProfile.newPassword?.length < 8) {
      return await error(
        "Error: This value is too short. It should have 8 characters or more."
      );
    }

    if (updateProfile.newPassword) {
      userPassword = updateProfile.newPassword;
    }

    if (updateProfile.email && user) {
      user.email = updateProfile.email;
    }
    return returnResult(token, userName, fetch(user) as Promise<InternalActor>);
  },
  async getActor(url: string): Promise<InternalActor> {
    console.info(`getActor => url: ${url}`);
    const actors = actorsData.default as Actor[];
    const actor = actors.find(($) => $ && $.id?.toString() === url);
    return await fetch(actor);
  },
  async fetchFollowing(
    token: string,
    userName: string,
    page: number
  ): Promise<CollectionPage> {
    console.info(
      `fetchFollowing => token: ${token}, userName: ${userName}, page: ${page}`
    );

    if (!following) {
      following = followingUserData.default as CollectionPage;
    }
    return returnResult(token, userName, fetch(following)) as Promise<
      CollectionPage
    >;
  },
  async fetchFollowers(
    token: string,
    userName: string,
    page: number
  ): Promise<CollectionPage> {
    console.info(
      `fetchFollowers => token: ${token}, userName: ${userName}, page: ${page}`
    );

    if (!followers) {
      followers = followerPage1Data.default as CollectionPage;
    }
    return returnResult(token, userName, fetch(followers)) as Promise<
      CollectionPage
    >;
  },
  async fetchPosts(
    token: string,
    userName: string,
    page: number,
    filter?: string
  ): Promise<OrderedCollectionPage> {
    let data: OrderedCollectionPage = Object.assign(
      {},
      // eslint-disable-next-line
      (collectionPageOneData.default as any) as OrderedCollectionPage
    );

    if (fetchPostCount > 1) {
      fetchPostCount = 0;
    }
    if (postPage === page && postFilter === filter) {
      fetchPostCount++;
    }

    console.info(
      `fetchPosts => fetch count: ${fetchPostCount}, token: ${token}, userName: ${userName}, page: ${page}, filter: ${filter}`
    );

    if (fetchPostCount > 1) {
      // eslint-disable-next-line
      data = Object.assign({}, collectionSecondFetchData.default as any as OrderedCollectionPage);
    }

    if (page === 1) {
      // eslint-disable-next-line
      data = Object.assign({}, collectionPageTwoData.default as any as OrderedCollectionPage);
      await delay(NEXT_PAGE_DELAY);
    }

    if (page === 2) {
      return await error("Not found");
    }

    if (filter) {
      const items = data.orderedItems.filter(($) => {
        const page2Actors = [
          "http://sally.example.org",
          "http://johnny.example.org",
          "http://john.example.org",
        ];
        const object = $ as Activity;
        const actor = object.actor as InternalActor;

        if (!page2Actors.some(($) => $ === actor.id?.toString())) {
          delete data.next;
        }
        return actor.internalUserId === filter;
      });
      postPage = page;
      postFilter = filter;
      data.orderedItems = items;
    }

    return returnResult(token, userName, fetch(data)) as Promise<
      OrderedCollectionPage
    >;
  },
  async writeToOutbox(
    token: string,
    userName: string,
    activity: Activity,
    summary?: string
  ): Promise<void> {
    if (summary) {
      activity.summary = summary;
    }
    console.info(
      `writeToOutbox => token: ${token}, userName: ${userName}, activity: ${toJSON(
        activity
      )}`
    );

    if (following && activity.type == "Follow") {
      const actors = actorsData.default as InternalActor[];
      const actor = actors.find(($) => $.id?.toString() === activity.to);

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

    return returnResult(token, userName, {} as Promise<void>);
  },
  getMedia(uri: string | undefined): string | undefined {
    console.info(`getMedia => uri: ${uri}`);
    return uri;
  },
  // Fediverse
  async fediverseSearchUserId(query: string): Promise<string | undefined> {
    console.info(`fediverseSearchUserId => query: ${query}`);
    const webfingers = webfingerData.default as Webfinger[];
    const webfinger = webfingers.find(($) =>
      $.subject.endsWith(`acct:${query}`)
    );

    if (!webfinger) {
      return error("No actor found!");
    }
    const link = webfinger.links.find(($) => $.rel === "self");
    return fetch(link?.href);
  },
  async fediverseGetActor(url: string): Promise<Actor> {
    console.info(`fediverseGetActor => url: ${url}`);
    const actors = actorsData.default as InternalActor[];
    const actor = actors.find(($) => $.id?.toString() === url);

    if (!actor) {
      return Promise.reject("No actor found.");
    }

    return fetch(actor);
  },
  async fediverseGetUser(url: string): Promise<InternalActor> {
    console.info(`fediverseGetUser => url: ${url}`);
    const actors = actorsData.default as InternalActor[];
    const actor = actors.find(($) => $.id?.toString() === url);

    if (!actor) {
      return Promise.reject("No actor found.");
    }

    return fetch(actor);
  },
  async fediversGetCollection(url: string): Promise<OrderedCollectionPage> {
    console.info(`fediversGetCollection => url: ${url}`);
    const followerRegex = /followers\?page=(?<page>\d+)$/gm;
    const followerMatch = followerRegex.exec(url);

    const followingRegex = /following\?page=(?<page>\d+)$/gm;
    const followingMatch = followingRegex.exec(url);

    if (followerMatch) {
      const page =
        followerMatch.groups !== undefined
          ? parseInt(followerMatch.groups.page)
          : 1;

      if (page === 2) {
        await delay(NEXT_PAGE_DELAY);
        return fetch(followerPage2Data.default);
      }
      return fetch(followerPage1Data.default);
    }

    if (followingMatch) {
      const page =
        followingMatch.groups !== undefined
          ? parseInt(followingMatch.groups.page)
          : 1;

      if (page === 2) {
        await delay(NEXT_PAGE_DELAY);
        return fetch(followingPage2Data.default);
      }
      return fetch(followingPage1Data.default);
    }

    return Promise.reject("No results");
  },
  // jest function
  // eslint-disable-next-line
  getJestReset(): any {
    if (process.env.NODE_ENV === "test") {
      return jest.fn().mockImplementation(() => {
        fetchPostCount = 0;
        following = undefined;
        followers = undefined;
        userPassword = "123";
        user = undefined;
      });
    }
  },
  getPassword(): string {
    return userPassword;
  },
} as ApiClientMocke;
