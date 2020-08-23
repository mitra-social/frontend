import { Actor } from "activitypub-objects";
export interface Post {
  actor: Actor;
  content: string;
  name: string;
  type: string;
}
