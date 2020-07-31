import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import {
  OrderedCollectionPage,
  ActivityObject,
  Link,
  Activity,
} from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { PostTypes } from "@/utils/post-types";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

/* 

  Helper function

*/
function normalizedCollection(
  collection: OrderedCollectionPage
): Promise<(ActivityObject | Link | URL | undefined)[]> {
  return Promise.all(
    collection.orderedItems.map(async (item: ActivityObject | Link | URL) => {
      if (
        (item as ActivityObject).type !== "Link" &&
        (typeof (item as ActivityObject).attributedTo === "string" ||
          typeof (item as Activity).actor === "string")
      ) {
        const url =
          (item as Activity).actor ?? (item as ActivityObject).attributedTo;

        if (!url) {
          return item;
        }

        return await client
          .fediverseGetActor(url.toString())
          .then(($) => {
            if (!$) {
              return item;
            }

            if ((item as Activity).actor) {
              (item as Activity).actor = $;
            } else if ((item as ActivityObject).attributedTo) {
              (item as ActivityObject).attributedTo = $;
            }

            return item;
          })
          .catch(() => {
            return Promise.resolve(undefined);
          });
      } else {
        return item;
      }
    })
  );
}

function normalizedAttachment(
  items: (ActivityObject | Link | URL | undefined)[]
): Promise<(ActivityObject | Link | URL | undefined)[]> {
  return Promise.all(
    items
      .filter($ => !!$)
      .map(async (item: ActivityObject | Link | URL | undefined) => {
        const attachments: (ActivityObject | Link | URL)[] = [];

        const activity = item as Activity;
        if (activity.object) {
          const object = (activity.object as ActivityObject);
          if (object.attachment) {
            if (Array.isArray(object.attachment)) {
              attachments.concat(object);
            } else {
              attachments.push(object.attachment)
            }
            (item as ActivityObject).attachment = attachments
              .filter(($: ActivityObject | Link | URL) => !!$)
              .map(($: ActivityObject | Link | URL) => ActivityObjectHelper.extractAttachmentLink($))
              .map(($: ActivityObject | Link | URL) => {
                const l = $ as Link;
                new Promise(resolve => {
                  const img = new Image();
                  img.onload = () => {
                    l.width = img.naturalWidth;
                    l.height = img.naturalHeight;
                    console.log("resolve")
                    resolve(l);
                  };
                  img.src = l.href.toString();
                });
                return l;
              })
          }
        }
        return item;
      })
  );
}

@Module({ namespaced: true })
class Collection extends VuexModule {
  public items: Array<ActivityObject | Link> = [];
  public partOf = "";
  public totalItems = 0;
  public page = 0;
  public hasPrev = false;
  public hasNext = true;
  public loadMorePostState = false;
  public excludedActors: string[] = [];

  get getPosts(): (ActivityObject | Link)[] | undefined {
    if (!this.items) {
      return;
    }

    const postTypeItems = this.items.filter(($) => $ && $.type in PostTypes);

    const activityItems = this.items
      .filter(($) => $ && !($.type in PostTypes))
      .filter(
        ($: Activity) =>
          !!$.object &&
          ActivityObjectHelper.hasProperty($.object, "type") &&
          ($.object as ActivityObject).type in PostTypes
      )
      .map(ActivityObjectHelper.extractObjectFromActivity);
    const posts = postTypeItems
      .concat(activityItems)
      .filter(
        (item) =>
          !this.excludedActors.some(
            (actor) =>
              ActivityObjectHelper.extractId(
                (item as ActivityObject).attributedTo as ActivityObject
              ) === actor
          )
      );
    return posts;
  }

  get getHasPrev(): boolean {
    return this.hasPrev;
  }

  get hasNextPage(): boolean {
    return this.hasNext;
  }

  get getLoadMorePostState(): boolean {
    return this.loadMorePostState;
  }

  get excludeActorLength(): number {
    return this.excludedActors.length;
  }

  get getPartOf(): string {
    return this.partOf;
  }

  get getTotalItems(): number {
    return this.totalItems;
  }

  get getPage(): number {
    return this.page;
  }

  @Mutation
  public setItems(items: Array<ActivityObject | Link>): void {
    this.items = items;
  }

  @Mutation
  public addItems(items: Array<ActivityObject | Link>): void {
    this.items = this.items.concat(items);
  }

  @Mutation
  public setHasPrev(hasPrev: boolean): void {
    this.hasPrev = hasPrev;
  }

  @Mutation
  public setHasNext(hasNext: boolean): void {
    this.hasNext = hasNext;
  }

  @Mutation
  public setLoadMorePostState(isLoading: boolean): void {
    this.loadMorePostState = isLoading;
  }

  @Mutation
  public setPage(page: number): void {
    this.page = page;
  }

  @Mutation
  public nextPage(): void {
    this.page++;
  }

  @Mutation
  public setActorFilter(filterActorList: string[]): void {
    this.excludedActors = filterActorList;
  }

  @Mutation
  public excludeActor(actorId: string): void {
    this.excludedActors.push(actorId);
  }

  @Mutation
  public removeExcludedActor(actorId: string): void {
    this.excludedActors = this.excludedActors.filter(($) => $ !== actorId);
  }

  @Mutation
  public reset() {
    this.items = [];
    this.partOf = "";
    this.totalItems = 0;
    this.page = 0;
    this.hasPrev = false;
    this.hasNext = true;
    this.loadMorePostState = false;
    this.excludedActors = [];
  }

  @Action({ rawError: true })
  public async fetchCollection(user: string): Promise<void> {
    this.context.commit("reset");
    this.context.commit("setLoadMorePostState", true);

    const token = AuthenticationUtil.getToken() || "";
    return await client
      .fetchPosts(token, user, this.page)
      .then((collection: OrderedCollectionPage) => {
        this.context.commit("setHasPrev", !!collection.prev);
        this.context.commit("setHasNext", !!collection.next);
        return collection;
      })
      .then((collection: OrderedCollectionPage) =>
        normalizedCollection(collection)
      )
      .then((items: (ActivityObject | Link | URL | undefined)[]) =>
        normalizedAttachment(items)
      )
      .then((items) => this.context.commit("setItems", items))
      .catch((error: Error) =>
        this.context.dispatch("Notify/error", error.message, { root: true })
      )
      .finally(() => this.context.commit("setLoadMorePostState", false));
  }

  @Action({ rawError: true })
  public async nextCollectionPage(user: string): Promise<void> {
    this.context.commit("setLoadMorePostState", true);

    const token = AuthenticationUtil.getToken() || "";
    this.context.commit("nextPage");

    return await client
      .fetchPosts(token, user, this.page)
      .then((collection: OrderedCollectionPage) => {
        this.context.commit("setHasPrev", !!collection.prev);
        this.context.commit("setHasNext", !!collection.next);
        return collection;
      })
      .then((collection: OrderedCollectionPage) =>
        normalizedCollection(collection)
      )
      .then((items: (ActivityObject | Link | URL | undefined)[]) =>
        normalizedAttachment(items)
      )
      .then((items: (ActivityObject | Link | URL | undefined)[]) => {
        this.context.commit("addItems", items);
      })
      .catch((error: Error) => {
        this.context.dispatch("Notify/error", error.message, { root: true });
      })
      .finally(() => this.context.commit("setLoadMorePostState", false));
  }

  @Action
  public addExcludeActor(actorId: string): void {
    this.context.commit("excludeActor", actorId);
  }

  @Action
  public removeActorFromExclude(actorId: string): void {
    this.context.commit("removeExcludedActor", actorId);
  }
}

export default Collection;
