import { Actors } from "activitypub-objects";

export interface User {
  type: Actors;
  userId: string;
  email: string;
  registeredAt: Date;
  preferredUsername: string;
  inbox: string;
}
