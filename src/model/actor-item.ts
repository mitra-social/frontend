import { Link, ActivityObject } from "activitypub-objects";

export interface ActorItem {
  id: number;
  actor: ActivityObject | Link;
}
