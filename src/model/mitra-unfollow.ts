import { ActivityObject, Link } from "activitypub-objects";
import {
  Activities,
  Activity
} from "activitypub-objects/dst/activities/activity";

import { Follow } from "./mitra-follow";

export declare class Unfollow implements Activity {
  readonly to: ActivityObject | Link;
  readonly object: Follow;
  readonly type = Activities.UNDO;
  constructor(to: ActivityObject | URL, object: Follow);
}
