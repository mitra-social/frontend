import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import router from "@/router";

import client from "apiClient";
import { Credential } from "@/model/credential";
import { CreateUser } from "@/model/create-user";
import { AuthenticationUtil } from "@/utils/authentication-util";

@Module({ namespaced: true })
class Authentication extends VuexModule {
  public token = AuthenticationUtil.getToken();
  public status = 0;
  public hasLoadedOnce = false;

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get authStatus(): number {
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
    return await client
      .login(credential)
      .then((token: string) => {
        AuthenticationUtil.setAuth(credential.username, token);
        this.context.commit("loginSuccess", token);
        router.push("/");
      })
      .catch(() => {
        this.context.commit("loginError", 401);
      });
  }

  @Action({ rawError: true })
  public async createUser(user: CreateUser): Promise<void> {
    return await client.createUser(user).then(() =>
      this.context.dispatch(
        "Notify/success",
        "You successfully signed up as a new user.",
        {
          root: true,
        }
      )
    );
  }
}
export default Authentication;
