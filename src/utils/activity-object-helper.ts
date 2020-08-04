import {
  ActivityObject,
  Link,
  Image as AcitvityPubImage,
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

    if (!activityObject) {
      return;
    }

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

    if (!activityObject) {
      return;
    }

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

    if (!activityObject || !activityObject.icon) {
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
    } else if ((icon as AcitvityPubImage).url) {
      return (icon as AcitvityPubImage).url.toString();
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

  public static extractAttachmentLink(
    object: ActivityObject | Link | URL | (Link | URL)[]
  ): Link {
    const link = object as Link;

    if (link.mediaType && link.mediaType.startsWith("image/")) {
      let imgLink = "";
      const activityObject = object as ActivityObject;

      if (activityObject.url) {
        const urlLink = activityObject.url as Link;

        if (urlLink.href) {
          imgLink = urlLink.href.toString();
        } else {
          imgLink = activityObject.url.toString();
        }
      } else if (link.href) {
        imgLink = link.href.toString();
      }

      if (imgLink) {
        link.href = new URL(imgLink);
      }
    }
    return link;
  }
}
