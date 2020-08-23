import { ActivityObject, CollectionPage, Link } from "activitypub-objects";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import client from "apiClient";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { InternalActor } from "@/model/internal-actor";

@Module({ namespaced: true })
class FollowerStore extends VuexModule {
  public followers: (ActivityObject | Link)[] = [];

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
  public setFollowers(actors: InternalActor[]): void {
    if (actors) {
      this.followers = [];

      actors.forEach(($) => {
        this.followers.push($);
      });
    }
  }

  @Action({ rawError: true })
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
              const url = (item as InternalActor).id;

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
