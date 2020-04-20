import { ActivityObject, Link } from "activitypub-objects";
import {
  Activities,
  Activity
} from "activitypub-objects/dst/activities/activity";

import { Follow } from "./mitra-follow";

export class Unfollow implements Activity {
  readonly to: ActivityObject | Link;
  readonly object: Follow;
  readonly type = Activities.UNDO;
  constructor(to: ActivityObject | Link, object: Follow) {
    this.to = to;
    this.object = object;
  };
}
