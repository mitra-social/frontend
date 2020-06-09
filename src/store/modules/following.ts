import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import {
  ActivityObject,
  Link,
  CollectionPage,
  Actor,
  Activities,
} from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { Following } from "@/model/following";

@Module({ namespaced: true })
class FollowingStore extends VuexModule {
  private following: Following[] = [];

  get getFollowing(): Following[] {
    return this.following;
  }

  get isFollowing() {
    const following = this.following;
    return (actor: ActivityObject): boolean => {
      return following.some(
        ($) =>
          ActivityObjectHelper.extractId($.actor) ===
          ActivityObjectHelper.extractId(actor)
      );
    };
  }

  @Mutation
  public setFollowing(actors: Actor[]): void {
    if (actors) {
      actors.forEach(($) => {
        const f = { actor: $, show: true };
        this.following.push(f);
      });
    }
  }

  @Mutation
  public addFollowing(actor: ActivityObject | Link): void {
    if (this.following) {
      this.following.push({ actor, show: true });
    }
  }

  @Mutation
  public removeFollowing(actor: ActivityObject | Link): void {
    if (this.following) {
      this.following = this.following.filter(($) => {
        return (
          ActivityObjectHelper.extractId($.actor) !==
          ActivityObjectHelper.extractId(actor)
        );
      });
    }
  }

  @Action
  public async fetchFollowing(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";

    return await client
      .fetchFollowing(token, user, 0)
      .then((collection: CollectionPage) => {
        return Promise.all(
          collection.items.map(async (item: ActivityObject | Link | URL) => {
            if (
              !ActivityObjectHelper.hasProperty(item, "name") &&
              !ActivityObjectHelper.hasProperty(item, "nameMap")
            ) {
              const url = (item as Actor).id;

              if (url) {
                return await client
                  .getActor(url.toString())
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
  public async follow(actor: Actor): Promise<void> {
    const objectFollow = ActivityObjectHelper.normalizedObjectFollow(actor);
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} followed ${objectFollow}`;
    const follow = {
      to: objectFollow,
      object: objectFollow,
      type: Activities.FOLLOW,
    };

    return await client.writeToOutbox(token, user, follow, summary).then(() => {
      this.context.commit("addFollowing", actor);
    });
  }

  @Action
  public async unfollow(actor: Actor): Promise<void> {
    const objectFollow = ActivityObjectHelper.normalizedObjectFollow(actor);
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} unfollowed ${objectFollow}`;
    const undo = {
      to: objectFollow,
      object: {
        to: objectFollow,
        object: objectFollow,
        type: Activities.FOLLOW,
      },
      type: Activities.UNDO,
    };

    return await client
      .writeToOutbox(token, user, undo as ActivityObject, summary)
      .then(() => {
        this.context.commit("removeFollowing", actor);
      });
  }
}
export default FollowingStore;
