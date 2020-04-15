import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import {
  OrderedCollectionPage,
  ActivityObject,
  Link
} from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { PostTypes } from "@/utils/post-types";

@Module({ namespaced: true })
class Collection extends VuexModule {
  public items: Array<ActivityObject | Link> = [];
  public partOf = "";
  public totalItems = 0;
  public page = 0;

  get getPosts() {
    return this.items?.filter($ => $.type in PostTypes);
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

  @Action
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
