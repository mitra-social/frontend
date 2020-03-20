import { Actor } from "activitypub-objects";
export interface Post {
  type: string;
  name: string;
  content: string;
  actor: Actor;
}
