import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Follow, Actor, Undo } from "activitypub-objects";

import client from "apiClient";
import { FollowPayload } from "@/model/follow-payload";
import { AuthenticationUtil } from "@/utils/authentication-util";

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
      console.log(this.following);
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
  public async follow(payload: FollowPayload): Promise<void> {
    const { user, object: followingActor } = payload;
    const token = AuthenticationUtil.getToken() || "";
    const userActor = {
      name: user.preferredUsername,
      type: user.type
    };
    const summary = `${user.preferredUsername} followed ${userActor.name}`;
    return await client
      .writeToOutbox(
        token,
        user.preferredUsername,
        new Follow(userActor, followingActor),
        summary
      )
      .then(() => {
        this.context.commit("addFollowing", followingActor);
      });
  }

  @Action
  public async unfollow(payload: FollowPayload): Promise<void> {
    const { user, object: followingActor } = payload;
    const token = AuthenticationUtil.getToken() || "";
    const userActor = {
      name: user.preferredUsername,
      type: user.type
    };
    const summary = `${user.preferredUsername} undo followed ${userActor.name}`;

    return await client
      .writeToOutbox(
        token,
        user.preferredUsername,
        new Undo(userActor, new Follow(userActor, followingActor)),
        summary
      )
      .then(() => {
        this.context.commit("removeFollowing", followingActor);
      });
  }
}
export default Following;
