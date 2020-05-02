import { ActivityObject, Link, Image } from "activitypub-objects";
import { RdfLangString } from "@/model/rdf-lang-string";
import { ActivityImplementation } from "@/model/mitra-activity";

export class ActivityObjectHelper {
  public static hasProperty(obj: object, property: string): boolean {
    try {
      return property in obj;
    } catch (err) {
      return false;
    }
  }

  public static extractActorName(
    object: ActivityObject | Link | URL | Array<ActivityObject | URL>
  ): string | undefined {
    const lang = navigator.language.substr(0, 2);
    if (ActivityObjectHelper.hasProperty(object, "name")) {
      return (object as ActivityObject).name;
    } else if (ActivityObjectHelper.hasProperty(object, "nameMap")) {
      return (object as RdfLangString).nameMap[lang];
    } else if (ActivityObjectHelper.hasProperty(object, "map")) {
      return (object as RdfLangString).map[lang];
    } else if (object) {
      return ActivityObjectHelper.normalizedActorUrl(object as URL);
    }

    return undefined;
  }

  public static normalizedToFollow(
    object: ActivityObject | Link | URL | Array<ActivityObject | URL>
  ): ActivityObject | Link {
    if (ActivityObjectHelper.hasProperty(object, "id")) {
      return { type: "Link", href: (object as ActivityObject).id };
    } else if (ActivityObjectHelper.hasProperty(object, "name")) {
      return object as ActivityObject;
    }
    return { type: "Link", href: object as URL };
  }

  public static normalizedObjectFollow(
    object: ActivityObject | Link | URL | Array<ActivityObject | URL>
  ): ActivityObject | URL | undefined {
    if (ActivityObjectHelper.hasProperty(object, "id")) {
      return (object as ActivityObject).id;
    } else if (
      ActivityObjectHelper.hasProperty(object, "type") &&
      !ActivityObjectHelper.hasProperty(object, "href")
    ) {
      return object as ActivityObject;
    }
    return object as URL;
  }

  public static extractId(
    object: ActivityObject | Link | URL | Array<ActivityObject | URL>
  ): string | undefined {
    if (ActivityObjectHelper.hasProperty(object, "id")) {
      return (object as ActivityObject).id?.toString();
    } else if (ActivityObjectHelper.hasProperty(object, "name")) {
      return (object as ActivityObject).name;
    } else if (ActivityObjectHelper.hasProperty(object, "href")) {
      return (object as Link).href.toString();
    }

    const url = object as URL;
    return url ? url.toString() : url;
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

  public static normalizedActorUrl(url: URL): string {
    const urlStr = url.toString();
    if (urlStr.startsWith("https://mastodon.social")) {
      return `${urlStr.substring(
        urlStr.lastIndexOf("/") + 1,
        urlStr.length
      )}@mastodon.social`;
    }
    return urlStr.substring(urlStr.indexOf("://") + 3, urlStr.indexOf("."));
  }

  public static extractObjectFromActivity(activity: ActivityImplementation): ActivityObject {
    const object = activity.object as ActivityObject;

    if (activity.actor) {
      object.attributedTo = activity.actor;
    }

    if (activity.updated) {
      object.updated = activity.updated;
    }

    if (activity.published) {
      object.published = activity.published;
    }

    return object;
  }
}
