import { ActivityObject, Link } from "activitypub-objects";

export interface FollowPayload {
  to: ActivityObject | Link | URL | Array<ActivityObject | URL>;
  object: ActivityObject | URL;
}
