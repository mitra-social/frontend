import {
  ActivityObject,
  ActivityType,
  CollectionPage,
  Link,
} from "activitypub-objects";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import client from "apiClient";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { InternalActor } from "@/model/internal-actor";

@Module({ namespaced: true })
class FollowingStore extends VuexModule {
  public following: InternalActor[] = [];

  get getFollowing(): InternalActor[] {
    return this.following;
  }

  get isFollowing(): (actor: ActivityObject) => boolean {
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
  public addFollowing(actor: InternalActor): void {
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

  @Mutation
  public setFollowing(actors: InternalActor[]): void {
    if (actors) {
      this.following = actors;
    }
  }

  @Action({ rawError: true })
  public async fetchFollowing(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    this.context.commit("setFollowing", []);

    return await client
      .fetchFollowing(token, user, 0)
      .then((collection: CollectionPage) => {
        return Promise.all(
          collection.items
            .filter(($) => !!$)
            .map(async (item: ActivityObject | Link | URL) => {
              let id;

              const activityObject = item as ActivityObject;
              if (activityObject.id) {
                id = activityObject.id;
              }

              const link = item as Link;

              if (link.href) {
                id = link.href;
              }

              if (typeof item === "string") {
                id = item;
              }

              if (id) {
                return await client
                  .fediverseGetActor(id.toString())
                  .then(($) => {
                    if ($) {
                      item = Object.assign(item, $);
                    }
                    return item;
                  })
                  .catch(() => Promise.resolve(undefined));
              }
              return item;
            })
        );
      })
      .then((actors) => {
        this.context.commit("setFollowing", actors);
      });
  }

  @Action({ rawError: true })
  public async follow(actor: InternalActor): Promise<void> {
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

  @Action({ rawError: true })
  public async unfollow(actor: InternalActor): Promise<void> {
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
