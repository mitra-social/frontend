import { ActivityObject, Link, Image } from 'activitypub-objects';
import { RdfLangString } from '@/model/rdf-lang-string';

export class ActivityObjectHelper {
  public static hasProperty(obj: object, property: string): boolean {
    try {
      return property in obj;
    } catch (err) {
      return false;
    }
  }

  public static extractActorName(object:
    | ActivityObject
    | Link
    | URL
    | Array<ActivityObject | URL>): string | undefined {
    const lang = navigator.language;
    if (ActivityObjectHelper.hasProperty(object, "name")) {
      return (object as ActivityObject).name;
    } else if (ActivityObjectHelper.hasProperty(object, "nameMap")) {
      return (object as RdfLangString).nameMap[lang];
    } else if (ActivityObjectHelper.hasProperty(object, "map")) {
      return (object as RdfLangString).map[lang];
    } else if (object) {
      const hostname = (object as URL).toString();
      return hostname.substring(hostname.indexOf('://') + 3, hostname.indexOf('.'));
    }

    return undefined;
  }

  public static extractIcon(object: ActivityObject): string | undefined {
    if (ActivityObjectHelper.hasProperty(object, "icon")) {
      const icon = object.icon;

      if (icon) {
        if (ActivityObjectHelper.hasProperty(icon, "href")) {
          return (icon as Link).href.toString();
        } else if (ActivityObjectHelper.hasProperty(icon, "url")) {
          return (icon as Image).url.toString();
        }
      }
    }
    return undefined;
  }
}
