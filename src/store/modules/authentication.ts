import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import router from "@/router";

import client from "apiClient";
import { Credential } from "@/model/credential";
import { AuthenticationUtil } from '@/utils/authentication-util';

@Module({ namespaced: true })
class Authentication extends VuexModule {
  public token = AuthenticationUtil.getToken();
  public status = "";
  public hasLoadedOnce = false;

  get isAuthenticated() {
    return !!this.token;
  }

  get authStatus() {
    return this.status;
  }

  @Mutation
  public loginSuccess(token: string): void {
    this.status = "success";
    this.token = token;
    this.hasLoadedOnce = true;
  }

  @Mutation
  public loginError(): void {
    this.status = "error";
    this.hasLoadedOnce = false;
  }

  @Action
  public login(credential: Credential): void {
    client
      .login(credential)
      .then(token => {
        AuthenticationUtil.setUser(credential.username);
        AuthenticationUtil.setToken(token);
        this.context.commit("loginSuccess", token);
        router.push("/");
      })
      .catch(err => {
        this.context.commit("loginError", err);
      });
  }
}
export default Authentication;
