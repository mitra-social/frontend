import { Actor as BaseActor } from "activitypub-objects";

type Modify<T, R> = Omit<T, keyof R> & R;

export type Actor = Modify<
    BaseActor,
    {
        preferredUsername?: string;
    }
>;
