import { Actor } from "activitypub-objects";

export interface ActorExtended extends Actor {
  followingIds: string[];
  followingCount: number;
  followersIds: string[];
  followerCount: number;
}
