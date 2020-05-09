import { Actors } from "activitypub-objects";

export interface User {
  type: Actors.PERSON;
  userId: string;
  email: string;
  registeredAt: Date;
  preferredUsername: string;
  inbox: string;
}
