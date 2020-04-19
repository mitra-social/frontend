import { ActivityObject } from "activitypub-objects";

import { User } from "./user";

export interface FollowPayload {
  user: User;
  object: ActivityObject | URL;
}
