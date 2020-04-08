import { OrderedCollectionPage } from "activitypub-objects";
import { Credential } from "@/model/credential";
import { User } from "@/model/user";

export interface ApiClient {
  login(credential: Credential): Promise<string>;
  getUser(token: string, user: string): Promise<User>;
  fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage>;
}
