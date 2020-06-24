import {
  OrderedCollectionPage,
  CollectionPage,
  Actor,
  Activity,
} from "activitypub-objects";

import { Credential } from "@/model/credential";
import { User } from "@/model/user";
import { CreateUser } from "@/model/create-user";

export interface ApiClient {
  login(credential: Credential): Promise<string>;
  createUser(user: CreateUser): Promise<void>;
  getUser(token: string, user: string): Promise<User>;
  getActor(url: string): Promise<Actor>;
  fetchFollowing(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage>;
  fetchFollowers(
    token: string,
    user: string,
    page: number
  ): Promise<CollectionPage>;
  fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage>;
  writeToOutbox(
    token: string,
    user: string,
    activity: Activity,
    summary?: string
  ): Promise<void>;
}
