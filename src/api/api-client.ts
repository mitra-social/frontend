import { OrderedCollection } from "activitypub-objects";
import { Credential } from "@/model/credential";

export interface ApiClient {
  login(credential: Credential): Promise<string>;
  fetchPosts(): Promise<OrderedCollection>;
}
