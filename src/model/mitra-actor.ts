import { Actor } from "activitypub-objects";

type Modify<T, R> = Omit<T, keyof R> & R;

export type ActorImplementation = Modify<
  Actor,
  {
    preferredUsername: string;
  }
>;
