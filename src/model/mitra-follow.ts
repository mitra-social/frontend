import { ActivityObject, Link } from "activitypub-objects";
import {
  Activities,
  Activity
} from "activitypub-objects/dst/activities/activity";

export class Follow implements Activity {
  readonly to: ActivityObject | Link;
  readonly object: ActivityObject | URL;
  readonly type = Activities.FOLLOW;
  constructor(to: ActivityObject | Link, object: ActivityObject | URL) {
    this.to = to;
    this.object = object;
  }
}
