import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { InternalActor } from "@/model/internal-actor";
import { PasswordChangeParam } from "@/model/password-change-param";

@Module({ namespaced: true })
class UserStore extends VuexModule {
  public user: InternalActor | undefined = undefined;

  get getUser() {
    return this.user;
  }

  get isUserFetch() {
    return !!this.user;
  }

  @Mutation
  public setUser(user: InternalActor): void {
    this.user = user;
  }

  @Action
  public async fetchUser(): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    const user = AuthenticationUtil.getUser() || "";

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
  public async updatePassword({
    oldPassword,
    newPassword,
  }: PasswordChangeParam): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    const userName = AuthenticationUtil.getUser() || "";

    await client
      .updatePassword(token, userName, oldPassword, newPassword)
      .then(() =>
        this.context.dispatch(
          "Notify/success",
          "Password was updated successfully.",
          {
            root: true,
          }
        )
      )
      .catch(() =>
        this.context.dispatch("Notify/error", "Updating password failed.", {
          root: true,
        })
      );
  }

  @Action
  public async updateUser(user: InternalActor): Promise<void> {
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
}
export default UserStore;
