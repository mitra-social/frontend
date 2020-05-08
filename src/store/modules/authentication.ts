import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import router from "@/router";

import client from "apiClient";
import { Credential } from "@/model/credential";
import { AuthenticationUtil } from "@/utils/authentication-util";

@Module({ namespaced: true })
class Authentication extends VuexModule {
  public token = AuthenticationUtil.getToken();
  public status = 0;
  public hasLoadedOnce = false;

  get isAuthenticated() {
    return !!this.token;
  }

  get authStatus() {
    return this.status;
  }

  @Mutation
  public loginSuccess(token: string): void {
    this.status = 200;
    this.token = token;
    this.hasLoadedOnce = true;
  }

  @Mutation
  public loginError(code: number): void {
    this.status = code;
    this.hasLoadedOnce = false;
  }

  @Action
  public async login(credential: Credential): Promise<void> {
    return client
      .login(credential)
      .then((token: string) => {
        AuthenticationUtil.setUser(credential.username);
        AuthenticationUtil.setToken(token);
        this.context.commit("loginSuccess", token);
        router.push("/");
      })
      .catch((err: Error) => {
        this.context.commit("loginError", 401);
      });
  }
}
export default Authentication;
