import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import router from "@/router";

import client from "apiClient";
import { Credential } from "@/model/credential";

@Module({ namespaced: true })
class Authentication extends VuexModule {
  public token = localStorage.getItem("user-token") || "";
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
    client.login(credential).then(token => {
      localStorage.setItem("user-token", token);
      this.context.commit("loginSuccess", token);
      router.push("/");
    });
  }
}
export default Authentication;
