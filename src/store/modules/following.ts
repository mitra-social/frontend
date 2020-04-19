import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Actor, ActivityObject, Link } from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { Follow } from "@/model/mitra-follow";
import { Unfollow } from "@/model/mitra-unfollow";

@Module({ namespaced: true })
class Following extends VuexModule {
  public following: Actor[] | undefined = undefined;

  get getFollowing() {
    return this.following;
  }

  @Mutation
  public setFollowing(actors: Actor[]): void {
    this.following = actors ? actors : [];
  }

  @Mutation
  public addFollowing(actor: Actor): void {
    if (this.following) {
      this.following.push(actor);
    }
  }

  @Mutation
  public removeFollowing(actor: Actor): void {
    if (this.following) {
      this.following = this.following.filter($ =>
        $.name && actor.name ? $.name !== actor.name : $ !== actor
      );
    }
  }

  @Action
  public async fetchFollowing(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";

    return await client.fetchFollowing(token, user).then(collection => {
      this.context.commit("setFollowing", collection.orderedItems as Actor[]);
    });
  }

  @Action
  public async follow(to: ActivityObject | Link): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} followed ${ActivityObjectHelper.extractActorName(
      to
    )}`;

    return await client
      .writeToOutbox(token, user, new Follow(to, to), summary)
      .then(() => {
        this.context.commit("addFollowing", to);
      })
      .catch(err => {
        console.log(err);
      });
  }

  @Action
  public async unfollow(to: ActivityObject | Link): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} undo followed ${ActivityObjectHelper.extractActorName(
      to
    )}`;

    return await client
      .writeToOutbox(token, user, new Unfollow(to, new Follow(to, to)), summary)
      .then(() => {
        this.context.commit("removeFollowing", to);
      });
  }
}
export default Following;
