import { ActivityObject, Link } from 'activitypub-objects';

export interface FollowPayload {
  to: ActivityObject | Link;
  object: ActivityObject | URL;
}