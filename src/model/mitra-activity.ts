import { ActivityObject, Link } from "activitypub-objects";
import { Activity as ActivityInterface } from "activitypub-objects/dst/activities/activity";

type Modify<T, R> = Omit<T, keyof R> & R;

export type Activity = Modify<
  ActivityInterface,
  {
    to?: ActivityObject | Link | URL | Array<ActivityObject | URL>;
    inReplyTo?: ActivityObject | Link | URL | Array<ActivityObject | URL>;
    bto?: ActivityObject | Link | URL | Array<ActivityObject | URL>;
    cc?: ActivityObject | Link | URL | Array<ActivityObject | URL>;
    bcc?: ActivityObject | Link | URL | Array<ActivityObject | URL>;
  }
>;
