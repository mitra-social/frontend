import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import {
  OrderedCollectionPage,
  ActivityObject,
  Link
} from "activitypub-objects";

import client from "apiClient";

const POST_TYPES: string[] = ["Article"];

@Module({ namespaced: true })
class Collection extends VuexModule {
  public items: Array<ActivityObject | Link> = [];
  public partOf = "";
  public totalItems = 0;
  public page = 0;

  get getPosts() {
    return this.items.filter($ => POST_TYPES.includes($.type));
  }

  get getPartOf() {
    return this.partOf;
  }

  get getTotolItems() {
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
  public fetchCollection(user: string): void {
    const token = sessionStorage.getItem("user-token") || "";
    client
      .fetchPosts(token, user, this.page)
      .then((collection: OrderedCollectionPage) => {
        this.context.commit("setItems", collection.orderedItems);
      });
  }
}
export default Collection;
