import { ActivityObject, Link } from "activitypub-objects";
import {
  Activities,
  Activity
} from "activitypub-objects/dst/activities/activity";

export class Follow implements Activity {
  readonly to: ActivityObject | Link;
  readonly object: ActivityObject | Link;
  readonly type = Activities.FOLLOW;
  constructor(to: ActivityObject | Link, object: ActivityObject | Link) {
    this.to = to;
    this.object = object;
  }
}
