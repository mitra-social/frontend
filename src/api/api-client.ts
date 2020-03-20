import { OrderedCollection } from "activitypub-objects";

export interface ApiClient {
  fetchPosts(): Promise<OrderedCollection>;
}
