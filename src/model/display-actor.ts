import { ActivityObject, Actors } from 'activitypub-objects';

export interface DisplayActor {
  id: string | undefined;
  name: string | undefined;
  icon?: string | undefined;
  type?: Actors | undefined;
  summary?: string | undefined;
  to?: ActivityObject | URL | undefined;
}