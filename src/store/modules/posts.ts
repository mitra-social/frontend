import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

import client from "apiClient";

import { Collection } from "@/model/collection";

@Module({ namespaced: true })
class Posts extends VuexModule {
  public items: Collection | undefined = undefined;

  get allPosts() {
    return this.items;
  }

  @Mutation
  public setPosts(posts: Collection): void {
    this.items = posts;
  }

  @Action
  public fetchPosts(): void {
    client
      .fetchPosts()
      // TODO: set type
      .then((posts: any) => {
        this.context.commit("setPosts", posts);
      });
  }
}
export default Posts;
