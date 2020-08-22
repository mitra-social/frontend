import { ActorType, Actor } from "activitypub-objects";

export interface InternalActor extends Actor {
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
