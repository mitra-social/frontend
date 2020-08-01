import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import {
  ActivityObject,
  Link,
  CollectionPage,
  ActivityType,
} from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { User } from "@/model/user";

@Module({ namespaced: true })
class FollowingStore extends VuexModule {
  private following: User[] = [];

  get getFollowing(): User[] {
    return this.following;
  }

  get isFollowing() {
    const following = this.following;
    return (actor: ActivityObject): boolean => {
      return following.some(
        ($) =>
          ActivityObjectHelper.extractId($) ===
          ActivityObjectHelper.extractId(actor)
      );
    };
  }

  @Mutation
  public setFollowing(actors: User[]): void {
    if (actors) {
      this.following = actors;
    }
  }

  @Mutation
  public addFollowing(actor: User): void {
    if (this.following) {
      this.following.push(actor);
    }
  }

  @Mutation
  public removeFollowing(actor: ActivityObject | Link): void {
    if (this.following) {
      this.following = this.following.filter(($) => {
        return (
          ActivityObjectHelper.extractId($) !==
          ActivityObjectHelper.extractId(actor)
        );
      });
    }
  }

  @Action
  public async fetchFollowing(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    this.context.commit("setFollowing", []);

    return await client
      .fetchFollowing(token, user, 0)
      .then((collection: CollectionPage) => {
        return Promise.all(
          collection.items.map(async (item: ActivityObject | Link | URL) => {
            if (
              !ActivityObjectHelper.hasProperty(item, "name") &&
              !ActivityObjectHelper.hasProperty(item, "nameMap")
            ) {
              const url = (item as User).id;

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
              return item;
            } else {
              return item;
            }
          })
        );
      })
      .then((actors) => {
        this.context.commit("setFollowing", actors);
      });
  }

  @Action
  public async follow(actor: User): Promise<void> {
    const objectFollow = ActivityObjectHelper.normalizedObjectFollow(actor);
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} followed ${objectFollow}`;
    const follow = {
      to: objectFollow,
      object: objectFollow,
      type: ActivityType.FOLLOW,
    };

    return await client
      .writeToOutbox(token, user, follow, summary)
      .then(() => {
        this.context.commit("addFollowing", actor);
        this.context.dispatch("fetchFollowing", user);
      })
      .catch(() => {
        this.context.dispatch(
          "Notify/error",
          `Following  ${ActivityObjectHelper.extractActorName(actor)} failed.`,
          { root: true }
        );
      });
  }

  @Action
  public async unfollow(actor: User): Promise<void> {
    const objectFollow = ActivityObjectHelper.normalizedObjectFollow(actor);
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} unfollowed ${objectFollow}`;
    const undo = {
      to: objectFollow,
      object: {
        to: objectFollow,
        object: objectFollow,
        type: ActivityType.FOLLOW,
      },
      type: ActivityType.UNDO,
    };

    return await client
      .writeToOutbox(token, user, undo as ActivityObject, summary)
      .then(() => {
        this.context.commit("removeFollowing", actor);
        this.context.dispatch("fetchFollowing", user);
      })
      .catch(() => {
        this.context.dispatch(
          "Notify/error",
          `Unfollowing  ${ActivityObjectHelper.extractActorName(
            actor
          )} failed.`,
          { root: true }
        );
      });
  }
}
export default FollowingStore;
