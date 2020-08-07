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
  public setUser(user: User): void {
    this.user = user;
  }

  @Action
  public async fetchUser(user: string): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";

    await client
      .getUser(token, user)
      .then((user) => {
        this.context.commit("setUser", user);
      })
      .catch((error) => {
        this.context.commit("Auth/loginError", 401, { root: true });
        return Promise.reject({ status: error.response.status });
      });
  }

  @Action
  public async updateUser(user: User): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    const userName = AuthenticationUtil.getUser() || "";

    await client
      .updateUser(token, userName, user)
      .then(() => {
        this.context.commit("setUser", user);
        this.context.dispatch("Notify/success", "Update profile success.", {
          root: true,
        });
      })
      .catch(() => {
        this.context.dispatch("Notify/error", "Updating user failed.", {
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
    const userName = AuthenticationUtil.getUser() || "";

    await client
      .updatePassword(token, userName, oldPassword, newPassword)
      .then(() =>
        this.context.dispatch("Notify/success", "Update password success.", {
          root: true,
        })
      )
      .catch(() =>
        this.context.dispatch("Notify/error", "Update password failed.", {
          root: true,
        })
      );
  }
}
export default UserStore;
