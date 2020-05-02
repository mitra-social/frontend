import { OrderedCollectionPage, OrderedCollection } from "activitypub-objects";

import { Credential } from "@/model/credential";
import { User } from "@/model/user";
import { ActivityImplementation } from "@/model/mitra-activity";

export interface ApiClient {
  login(credential: Credential): Promise<string>;
  getUser(token: string, user: string): Promise<User>;
  fetchFollowing(token: string, user: string, page: number): Promise<OrderedCollection>;
  fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage>;
  writeToOutbox(
    token: string,
    user: string,
    activity: ActivityImplementation,
    summary?: string
  ): Promise<void>;
}
