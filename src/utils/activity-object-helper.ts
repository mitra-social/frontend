import {
  ActivityObject,
  Link,
  Image,
  Actor,
  Activity,
} from "activitypub-objects";

export class ActivityObjectHelper {
  public static hasProperty(obj: object, property: string): boolean {
    try {
      return property in obj;
    } catch (err) {
      return false;
    }
  }

  public static extractActorName(
    object: ActivityObject | Link | URL
  ): string | undefined {
    const activityObject = object as ActivityObject;

    if (activityObject.nameMap) {
      const lang = navigator.language.substr(0, 2);

      if (lang in activityObject.nameMap) {
        return activityObject.nameMap[lang];
      }
    }

    if (activityObject.name) {
      return activityObject.name;
    } else if ((object as Actor).preferredUsername) {
      return (object as Actor).preferredUsername;
    } else if (activityObject.id) {
      return activityObject.id?.toString() ?? undefined;
    } else if (typeof object === "string") {
      return object;
    }

    return undefined;
  }

  public static normalizedToFollow(
    object: ActivityObject | Link | URL | Array<ActivityObject | URL>
  ): ActivityObject | Link {
    const activityObject = object as ActivityObject;

    if (activityObject.id) {
      return { type: "Link", href: activityObject.id };
    } else if (activityObject.name) {
      return activityObject;
    }
    return { type: "Link", href: object as URL };
  }

  public static normalizedObjectFollow(
    object: ActivityObject | Link | URL | Array<ActivityObject | URL>
  ): ActivityObject | URL | undefined {
    const activityObject = object as ActivityObject;

    if (activityObject.id) {
      return activityObject.id;
    } else if (activityObject.type && !(object as Link).href) {
      return activityObject;
    }
    return object as URL;
  }

  public static extractId(
    object:
      | ActivityObject
      | Link
      | URL
      | Array<ActivityObject | URL>
      | undefined
  ): string | undefined {
    const activityObject = object as ActivityObject;

    if (typeof object === "string") {
      return object;
    } else if (activityObject.id) {
      return activityObject.id.toString();
    } else if (activityObject.name) {
      return activityObject.name;
    } else if ((object as Link).href) {
      return (object as Link).href.toString();
    }
  }

  public static extractIcon(object: ActivityObject): string | undefined {
    const activityObject = object as ActivityObject;

    if (!activityObject.icon) {
      return undefined;
    }

    const icon = activityObject.icon;

    if (!icon) {
      return undefined;
    }

    if (Array.isArray(icon)) {
      return undefined;
    }

    if ("string" == typeof icon) {
      return icon;
    }

    if ((icon as Link).href) {
      return (icon as Link).href.toString();
    } else if ((icon as Image).url) {
      return (icon as Image).url.toString();
    }

    return undefined;
  }

  public static extractObjectFromActivity(activity: Activity): ActivityObject {
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
