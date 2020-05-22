import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import {
  OrderedCollectionPage,
  ActivityObject,
  Link,
} from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { PostTypes } from "@/utils/post-types";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { Activity } from "@/model/mitra-activity";

@Module({ namespaced: true })
class Collection extends VuexModule {
  public items: Array<ActivityObject | Link> = [];
  public partOf = "";
  public totalItems = 0;
  public page = 0;

  get getPosts() {
    if (!this.items) {
      return;
    }

    const postTypeItems = this.items.filter(($) => $.type in PostTypes);

    const activityItems = this.items
      .filter(($) => !($.type in PostTypes))
      .filter(
        ($: Activity) =>
          !!$.object &&
          ActivityObjectHelper.hasProperty($.object, "type") &&
          ($.object as ActivityObject).type in PostTypes
      )
      .map(ActivityObjectHelper.extractObjectFromActivity);
    return postTypeItems.concat(activityItems);
  }

  get getPartOf() {
    return this.partOf;
  }

  get getTotalItems() {
    return this.totalItems;
  }

  get getPage() {
    return this.page;
  }

  @Mutation
  public setItems(items: Array<ActivityObject | Link>): void {
    this.items = items;
  }

  @Action({ rawError: true })
  public async fetchCollection(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    return await client
      .fetchPosts(token, user, this.page)
      .then((collection: OrderedCollectionPage) => {
        this.context.commit("setItems", collection.orderedItems);
      });
  }
}
export default Collection;
