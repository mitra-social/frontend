import { Collection } from "@/model/collection";

export interface ApiClient {
  fetchPosts(): Promise<Collection>;
}
