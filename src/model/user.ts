import { ActorType } from "activitypub-objects";

export interface User {
  type: ActorType.PERSON;
  userId: string;
  email: string;
  registeredAt: Date;
  preferredUsername: string;
  inbox: string;
}
