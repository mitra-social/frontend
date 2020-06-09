import { ActivityObject, Link } from "activitypub-objects";

export interface Following {
  actor: (ActivityObject | Link) | undefined;
  show: boolean;
}
