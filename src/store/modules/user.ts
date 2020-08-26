import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import client from "apiClient";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { InternalActor } from "@/model/internal-actor";
import { UpdateProfile } from "@/model/update-profile";

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
  public async updateProfile(updateProfile: UpdateProfile): Promise<void> {
    const token = AuthenticationUtil.getToken() || "";
    const userName = AuthenticationUtil.getUser() || "";

    await client
      .updateProfile(token, userName, updateProfile)
      .then((updatedUser) => {
        this.context.commit("setUser", updatedUser);
        this.context.dispatch("Notify/success", "Update profile success.", {
          root: true,
        });
      })
      .catch((err) => {
        this.context.dispatch("Notify/error", err, {
          root: true,
        });
      });
  }
}
export default UserStore;
