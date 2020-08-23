import { Link, ActivityObject } from "activitypub-objects";

export interface ActorItem {
  actor: ActivityObject | Link;
  id: number;
}
