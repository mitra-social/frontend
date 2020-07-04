import { ActorType, Actor } from "activitypub-objects";

export interface User extends Actor {
  type: ActorType.PERSON;
  userId: string;
  email: string;
  registeredAt: Date;
  preferredUsername: string;
  inbox: string;
  following: string;
  followers: string;
  outbox: string;
}
