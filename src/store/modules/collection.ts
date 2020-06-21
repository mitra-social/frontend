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

@Module({ namespaced: true })
class Collection extends VuexModule {
  public items: Array<ActivityObject | Link> = [];
  public partOf = "";
  public totalItems = 0;
  public page = 0;
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
        return Promise.all(
          collection.orderedItems.map(
            async (item: ActivityObject | Link | URL) => {
              if (
                (item as ActivityObject).type !== "Link" &&
                (typeof (item as ActivityObject).attributedTo === "string" ||
                  typeof (item as Activity).actor === "string")
              ) {
                const url =
                  (item as Activity).actor ??
                  (item as ActivityObject).attributedTo;

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
            }
          )
        );
      })
      .then((items) => {
        this.context.commit("setItems", items);
      })
      .catch(error => {
        this.context.dispatch("Notify/error", error, { root: true });
      });
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
