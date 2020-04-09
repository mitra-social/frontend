import { ActivityObject } from "activitypub-objects";

export interface RdfLangString extends ActivityObject {
  map: { [key: string]: string };
}
