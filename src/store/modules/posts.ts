import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { OrderedCollection } from "activitypub-objects";

import client from "apiClient";

@Module({ namespaced: true })
class Posts extends VuexModule {
  public posts: OrderedCollection | undefined = undefined;

  get getPosts() {
    return this.posts;
  }

  @Mutation
  public setPosts(posts: OrderedCollection): void {
    this.posts = posts;
  }

  @Action
  public fetchPosts(): void {
    client.fetchPosts().then((posts: OrderedCollection) => {
      this.context.commit("setPosts", posts);
    });
  }
}
export default Posts;
