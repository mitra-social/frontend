import { ActivityObject } from "activitypub-objects";

export interface RDF extends ActivityObject {
  nameMap: { [key: string]: string };
}
