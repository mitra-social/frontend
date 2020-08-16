import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { ActivityObject, Link, CollectionPage } from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { User } from "@/model/user";

@Module({ namespaced: true })
class FollowerStore extends VuexModule {
  private followers: (ActivityObject | Link)[] = [];

  get getFollowers(): (ActivityObject | Link)[] {
    return this.followers;
  }

  get isFollower() {
    return (actor: ActivityObject): boolean => {
      return this.followers.some(
        ($) =>
          ActivityObjectHelper.extractId($) ===
          ActivityObjectHelper.extractId(actor)
      );
    };
  }

  @Mutation
  public setFollowers(actors: User[]): void {
    if (actors) {
      this.followers = [];

      actors.forEach(($) => {
        this.followers.push($);
      });
    }
  }

  @Action
  public async fetchFollowers(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";

    return await client
      .fetchFollowers(token, user, 0)
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
        this.context.commit("setFollowers", actors);
      });
  }
}
export default FollowerStore;
