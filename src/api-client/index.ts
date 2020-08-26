import {
  OrderedCollectionPage,
  CollectionPage,
  Actor,
  Activity,
} from "activitypub-objects";

import { Credential } from "@/model/credential";
import { InternalActor } from "@/model/internal-actor";
import { CreateUser } from "@/model/create-user";
import { UpdateUser } from "@/model/update-user";

export interface ApiClient {
  login(credential: Credential): Promise<string>;
  createUser(user: CreateUser): Promise<void>;
  updateProfile(
    token: string,
    user: string,
    updateProfile: UpdateUser
  ): Promise<InternalActor>;
  getUser(token: string, user: string): Promise<InternalActor>;
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
    page: number,
    filter?: string
  ): Promise<OrderedCollectionPage>;
  writeToOutbox(
    token: string,
    user: string,
    activity: Activity,
    summary?: string
  ): Promise<void>;
  getMedia(uri: string | undefined): string | undefined;
  // Fediverse
  fediverseGetActor(url: string): Promise<Actor>;
  fediverseSearchUserId(query: string): Promise<string | undefined>;
  fediverseGetUser(url: string): Promise<InternalActor>;
  fediversGetCollection(id: string): Promise<OrderedCollectionPage>;
}
