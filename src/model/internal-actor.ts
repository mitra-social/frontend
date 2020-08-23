import { ActorType, Actor } from "activitypub-objects";

export interface InternalActor extends Actor {
  email: string;
  followers: string;
  following: string;
  inbox: string;
  internalUserId: string;
  outbox: string;
  preferredUsername: string;
  registeredAt: Date;
  type: ActorType.PERSON;
}
