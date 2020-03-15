import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

import client from "apiClient";

import { Collection } from "@/model/collection";

@Module({ namespaced: true })
class Posts extends VuexModule {
  public posts: Collection | undefined = undefined;

  get getPosts() {
    return this.posts;
  }

  @Mutation
  public setPosts(posts: Collection): void {
    this.posts = posts;
  }

  @Action
  public fetchPosts(): void {
    client.fetchPosts().then((posts: Collection) => {
      this.context.commit("setPosts", posts);
    });
  }
}
export default Posts;
