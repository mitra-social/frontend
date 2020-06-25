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

        if (url) {
          return await client
            .getActor(url.toString())
            .then(($) => {
              if ($) {
                if ((item as Activity).actor) {
                  (item as Activity).actor = $;
                } else if ((item as ActivityObject).attributedTo) {
                  (item as ActivityObject).attributedTo = $;
                }
              }
              return item;
            })
            .catch(() => Promise.resolve(undefined));
        } else {
          return item;
        }
      } else {
        return item;
      }
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
    return postTypeItems
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
  }

  get getHasPrev(): boolean {
    return this.hasPrev;
  }

  get getHasNext(): boolean {
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
  public pageUp(): void {
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

  @Action({ rawError: true })
  public async fetchCollection(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    return await client
      .fetchPosts(token, user, this.page)
      .then((collection: OrderedCollectionPage) => {
        this.context.commit("setHasPrev", !!collection.prev);
        this.context.commit("setHasNext", !!collection.next);
        return collection;
      })
      .then((colleciton: OrderedCollectionPage) =>
        normalizedCollection(colleciton)
      )
      .then((items) => {
        this.context.commit("setItems", items);
      })
      .catch((error: Error) => {
        this.context.dispatch("Notify/error", error.message, { root: true });
      });
  }

  @Action({ rawError: true })
  public async nextCollection(user: string): Promise<void> {
    this.context.commit("setLoadMorePostState", true);
    const token = AuthenticationUtil.getToken() || "";
    this.context.commit("pageUp");

    return await client
      .fetchPosts(token, user, this.page)
      .then((collection: OrderedCollectionPage) => {
        this.context.commit("setHasPrev", !!collection.prev);
        this.context.commit("setHasNext", !!collection.next);
        return collection;
      })
      .then((colleciton: OrderedCollectionPage) =>
        normalizedCollection(colleciton)
      )
      .then((items) => {
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
