import { ActorType, Actor } from "activitypub-objects";

export interface User extends Actor {
  type: ActorType.PERSON;
  internalUserId: string;
  preferredUsername: string;
  email: string;
  registeredAt: Date;
  inbox: string;
  following: string;
  followers: string;
  outbox: string;
}
