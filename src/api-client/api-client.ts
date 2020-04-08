import { OrderedCollectionPage } from "activitypub-objects";
import { Credential } from "@/model/credential";

export interface ApiClient {
  login(credential: Credential): Promise<string>;
  fetchPosts(
    token: string,
    user: string,
    page: number
  ): Promise<OrderedCollectionPage>;
}
