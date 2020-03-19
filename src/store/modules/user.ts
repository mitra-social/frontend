import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

import client from "apiClient";
import { User as UserModel } from "@/model/user";
import { Credential } from "@/model/credential";

@Module({ namespaced: true })
class User extends VuexModule {
  public user: UserModel | undefined = undefined;

  get getUser() {
    return this.user;
  }

  @Mutation
  public fetchUserSuccess(user: UserModel): void {
    this.user = user;
  }

  @Action
  public(credential: Credential): void {
    client.login(credential).then(user => {
      this.context.commit("fetchUserSuccess", user);
    });
  }
}
export default User;
