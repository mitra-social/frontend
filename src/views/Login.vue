<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8">
      <v-card class="elevation-12">
        <v-toolbar
          :light="$vuetify.theme.dark"
          :dark="!$vuetify.theme.dark"
          flat
        >
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-form v-model="valid" @submit.prevent="handleSubmit" ref="loginForm">
          <v-card-text>
            <v-alert v-if="authStatus === 401" dense outlined type="error">
              The user name or password you entered isn't correct. Try entering
              it again.
            </v-alert>
            <v-text-field
              label="Login"
              name="login"
              prepend-icon="mdi-account"
              type="text"
              v-model="user"
              :rules="[rules.required]"
            />
            <v-text-field
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="password"
              :rules="[rules.required]"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn id="signup-link" text x-small link :to="{ name: 'Signup' }">
              You don't have an account? Create one now!
            </v-btn>
            <v-spacer />
            <v-btn
              id="login-btn"
              type="submit"
              :light="$vuetify.theme.dark && valid"
              :dark="!$vuetify.theme.dark && valid"
              :disabled="!valid"
              >Login</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Credential } from "@/model/credential";

const authStore = namespace("Auth");
const notifyStore = namespace("Notify");

@Component
export default class Login extends Vue {
  /**********************
   * data fields
   **********************/

  private password = "";
  private user = "";
  private valid = false;

  private rules = {
    required: ($: string) => !!$ || "Required.",
  };

  @Ref("loginForm") readonly form!: HTMLFormElement;

  /**********************
   * store getters
   **********************/
  @authStore.Getter
  public authStatus!: number;

  /**********************
   * store actions
   **********************/
  @notifyStore.Action
  public error!: (message: string) => void;

  @authStore.Action
  public login!: (credential: Credential) => void;

  /**********************
   * Lifecycle hooks
   **********************/
  private created(): void {
    if (
      this.$router.currentRoute.params.redirectFrom &&
      this.authStatus === 401
    ) {
      this.error("Authenctication failed.");
    }
  }

  /**********************
   * public functions
   **********************/
  public handleSubmit(): void {
    if (this.form.validate()) {
      this.login({ username: this.user, password: this.password });
    }
  }
}
</script>

<style lang="scss">
.signin {
  width: 500px;
}
</style>
