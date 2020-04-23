import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Actor, ActivityObject, Link } from "activitypub-objects";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { Follow } from "@/model/mitra-follow";
import { Unfollow } from "@/model/mitra-unfollow";
import { FollowPayload } from "@/model/mitra-follow-payload";

@Module({ namespaced: true })
class Following extends VuexModule {
  public following: (ActivityObject | Link)[] | undefined = undefined;

  get getFollowing() {
    return this.following;
  }

  @Mutation
  public setFollowing(actors: Actor[]): void {
    this.following = actors ? actors : [];
  }

  @Mutation
  public addFollowing(actor: ActivityObject | Link): void {
    if (this.following) {
      this.following.push(actor);
    }
  }

  @Mutation
  public removeFollowing(actor: ActivityObject | Link): void {
    if (this.following) {
      this.following = this.following.filter($ => {
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

    return await client.fetchFollowing(token, user).then(collection => {
      this.context.commit("setFollowing", collection.orderedItems as Actor[]);
    });
  }

  @Action
  public async follow(payload: FollowPayload): Promise<void> {
    const { to, object } = payload;
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} followed ${to}`;

    return await client
      .writeToOutbox(token, user, new Follow(to, object), summary)
      .then(() => {
        this.context.commit("addFollowing", to);
      });
  }

  @Action
  public async unfollow(payload: FollowPayload): Promise<void> {
    const { to, object } = payload;
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";
    const summary = `${user} undo followed ${to}`;

    return await client
      .writeToOutbox(
        token,
        user,
        new Unfollow(to, new Follow(to, object) as ActivityObject),
        summary
      )
      .then(() => {
        this.context.commit("removeFollowing", to);
      });
  }
}
export default Following;
