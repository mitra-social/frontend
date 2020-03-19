import { Collection } from "@/model/collection";
import { Credential } from "@/model/credential";

export interface ApiClient {
  login(credential: Credential): Promise<string>;
  fetchPosts(): Promise<Collection>;
}
