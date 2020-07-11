import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { OrderedCollectionPage, Link, ActivityObject, Actor } from 'activitypub-objects';

import client from "apiClient";
import { User } from '@/model/user';

/*

  Helper function

*/
function normalizedCollection(
  collection: OrderedCollectionPage
): Promise<(ActivityObject | Link | URL | undefined)[]> {
  return Promise.all(
    collection.orderedItems.map(async (item: ActivityObject | Link | URL) => {
      const url = typeof item === "string" ? item : (item as Actor).id;

      if (url) {
        return await client
          .fediverseGetActor(url.toString())
          .then(($) => {
            if ($) {
              item = $;
            }
            return item;
          })
          .catch(() => Promise.resolve(undefined));
      }
    })
  );
}

@Module({ namespaced: true })
class FindUserStore extends VuexModule {
  private query = "";
  private user: User | undefined = undefined;
  private loadingState = false;

  private followerCollectionPage: (ActivityObject | Link | URL | undefined)[] = [];
  private followerCollectionItemCount = 0;
  private followerCollectionPaging = 0;
  private hasNextFollowerPage = false;
  private isFollowerLoadingState = false;

  private followingCollectionPage: (ActivityObject | Link | URL | undefined)[] = [];
  private followingCollectionItemCount = 0;
  private followingCollectionPaging = 0;
  private hasNextFollowingPage = false;
  private isFollowingLoadingState = false;

  // finding user
  get getQuery(): string {
    return this.query;
  }

  get getUser(): User | undefined {
    return this.user;
  }

  get isLoading(): boolean {
    return this.loadingState;
  }

  // Followers
  get getFollowersCollectionCount(): number | undefined {
    return this.followerCollectionItemCount;
  }

  get getFollowers(): (ActivityObject | Link | URL | undefined)[] {
    return this.followerCollectionPage.filter($ => $ !== undefined);
  }

  get isFollowersLoading() {
    return this.isFollowerLoadingState;
  }

  get getHasNextFollowerPage() {
    return this.hasNextFollowerPage
  }

  // Following
  get getFollowingCollectionCount(): number | undefined {
    return this.followingCollectionItemCount;
  }

  get getFollowing(): (ActivityObject | Link | URL | undefined)[] {
    return this.followingCollectionPage.filter($ => $ !== undefined);
  }

  get isFollowingLoading(): boolean {
    return this.isFollowingLoadingState;
  }

  get getHasNextFollowingPage() {
    return this.hasNextFollowingPage
  }

  // finding user
  @Mutation
  public setQuery(query: string) {
    this.query = query;
  }

  @Mutation
  public setUser(user: User): void {
    this.user = user;
  }

  @Mutation
  public loadingStart(): void {
    this.loadingState = true;
  }

  @Mutation
  public loadingFinish(): void {
    this.loadingState = false;
  }

  // followers
  @Mutation
  public setFollowers(followerCollectionPage: (ActivityObject | Link | URL | undefined)[]): void {
    this.followerCollectionPage = followerCollectionPage;
  }

  @Mutation
  public addFollowers(followerCollectionPage: (ActivityObject | Link | URL | undefined)[]): void {
    this.followerCollectionPage = this.followerCollectionPage.concat(followerCollectionPage);
  }

  @Mutation
  public setFollowerCollectionCount(count: number): void {
    this.followerCollectionItemCount = count;
  }

  @Mutation
  public setHasNextFollowerPage(hasNext: boolean): void {
    this.hasNextFollowerPage = hasNext;
  }

  @Mutation
  public setFollowerCollectionPaging(page: number): void {
    this.followerCollectionPaging = page;
  }

  @Mutation
  public loadingFollowerStart(): void {
    this.isFollowerLoadingState = true;
  }

  @Mutation
  public loadingFollowerFinish(): void {
    this.isFollowerLoadingState = false;
  }

  // following
  @Mutation
  public setFollowing(followingCollectionPage: (ActivityObject | Link | URL | undefined)[]): void {
    this.followingCollectionPage = followingCollectionPage;
  }

  @Mutation
  public addFollowing(followingCollectionPage: (ActivityObject | Link | URL | undefined)[]): void {
    this.followingCollectionPage = this.followingCollectionPage.concat(followingCollectionPage);
  }

  @Mutation
  public setFollowingCount(count: number): void {
    this.followingCollectionItemCount = count;
  }

  @Mutation
  public setFollowingCollectionPage(page: number): void {
    this.followingCollectionPaging = page;
  }

  @Mutation
  public setHasNextFollowingPage(hasNext: boolean): void {
    this.hasNextFollowingPage = hasNext;
  }

  @Mutation
  public loadingFollowingStart(): void {
    this.isFollowingLoadingState = true;
  }

  @Mutation
  public loadingFollowingFinish(): void {
    this.isFollowingLoadingState = false;
  }

  // finding user
  @Action
  public queryAction(query: string) {
    this.context.commit("setQuery", query);
  }

  @Action
  public async findUser(query: string): Promise<void> {
    this.context.commit("loadingStart");

    await client.fediverseSearchUserId(query).then(async (id) => {
      if (id) {
        await client.fediverseGetUser(id).then(user => {
          this.context.dispatch("fetchFollowers", { url: user.followers, add: false });
          this.context.dispatch("fetchFollowing", { url: user.following, add: false });
          this.context.commit("setUser", user);
        });
      }
    }).finally(() => this.context.commit("loadingFinish"));
  }

  // followers
  @Action
  public fetchFollowers({ url, add }: any): void {
    this.context.commit("loadingFollowerStart");
    add ?
      this.context.commit("setFollowerCollectionPaging", this.followerCollectionPaging + 1) :
      this.context.commit("setFollowerCollectionPaging", 1);

    client.fediversGetCollection(`${url}?page=${this.followerCollectionPaging}`)
      .then(collection => {
        this.context.commit("setFollowerCollectionCount", collection.totalItems);
        this.context.commit("setHasNextFollowerPage", !!collection.next);
        return collection;
      })
      .then(collection => normalizedCollection(collection))
      .then(collection => {
        add ?
          this.context.commit("addFollowers", collection) :
          this.context.commit("setFollowers", collection);
      })
      .finally(() => this.context.commit("loadingFollowerFinish"))
  }

  // following
  @Action
  public fetchFollowing({ url, add }: any): void {
    this.context.commit("loadingFollowingStart");
    add ?
      this.context.commit("setFollowingCollectionPage", this.followingCollectionPaging + 1) :
      this.context.commit("setFollowingCollectionPage", 1);

    client.fediversGetCollection(`${url}?page=${this.followingCollectionPaging}`)
      .then(collection => {
        this.context.commit("setFollowingCount", collection.totalItems);
        this.context.commit("setHasNextFollowingPage", !!collection.next);
        return collection;
      })
      .then(collection => normalizedCollection(collection))
      .then(collection => {
        if (add) {
          this.context.commit("addFollowing", collection);
        } else {
          this.context.commit("setFollowing", collection);
        }
      })
      .finally(() => this.context.commit("loadingFollowingFinish"))
  }
}
export default FindUserStore;
