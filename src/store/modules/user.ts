import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { User } from "@/model/user";
import { PasswordChangeParam } from "@/model/password-change-param";

@Module({ namespaced: true })
class UserStore extends VuexModule {
  public user: User | undefined = undefined;

  get getUser() {
    return this.user;
  }

  get isUserFetch() {
    return !!this.user;
  }

  @Mutation
  public fetchUserSuccess(user: User): void {
    this.user = user;
  }

  @Action
  public async fetchUser(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";

    await client
      .getUser(token, user)
      .then((user) => {
        this.context.commit("fetchUserSuccess", user);
      })
      .catch((error) => {
        this.context.commit("Auth/loginError", 401, { root: true });
        return Promise.reject({ status: error.response.status });
      });
  }

  @Action
  public async updateUser(user: User): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";

    await client.updateUser(token, user).catch(() => {
      this.context.dispatch("Notify/error", "Update user failed.", {
        root: true,
      });
    });
  }

  @Action
  public async updatePassword({
    oldPassword,
    newPassword,
  }: PasswordChangeParam): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";

    await client.updatePassword(token, oldPassword, newPassword).catch(() => {
      this.context.dispatch("Notify/error", "Update password failed.", {
        root: true,
      });
    });
  }
}
export default UserStore;
