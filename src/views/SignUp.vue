<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8">
      <v-card class="elevation-12">
        <v-toolbar
          :light="$vuetify.theme.dark"
          :dark="!$vuetify.theme.dark"
          flat
        >
          <v-toolbar-title>Sign Up</v-toolbar-title>
        </v-toolbar>
        <v-form
          lazy-validation
          v-model="valid"
          ref="signUpForm"
          @submit.prevent="handleSubmit"
        >
          <v-card-text>
            <v-alert v-if="alertMsg" dense outlined type="error">
              {{ alertMsg }}
            </v-alert>
            <v-text-field
              label="Username"
              name="user"
              prepend-icon="mdi-account"
              type="text"
              v-model="user"
              :rules="[rules.required, rules.usernameMin, rules.username]"
            />
            <v-text-field
              label="E-mail address"
              name="email"
              prepend-icon="mdi-email"
              type="email"
              v-model="email"
              :rules="[rules.required, rules.emailRules]"
            />
            <v-text-field
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="[rules.required, rules.min]"
              @click:append="showPassword = !showPassword"
            />
            <v-text-field
              id="confirm-password"
              label="Confirm password"
              name="confirmPassword"
              prepend-icon="mdi-lock-check"
              v-model="confirmPassword"
              :append-icon="showConfirmPasswor ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirmPasswor ? 'text' : 'password'"
              :rules="[rules.required]"
              :error="hasConfirmPwdError"
              :error-messages="confirmPwdErrorMsgs"
              @input="resetConfirmPassword()"
              @click:append="showConfirmPasswor = !showConfirmPasswor"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn id="login" text x-small link :to="{ name: 'Login' }">
              You already have an account? Sign in now!
            </v-btn>
            <v-spacer />
            <v-btn
              id="submit"
              type="submit"
              :light="$vuetify.theme.dark && valid"
              :dark="!$vuetify.theme.dark && valid"
              :disabled="!valid"
              >Sign Up</v-btn
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

import { CreateUser } from "@/model/create-user";

const auth = namespace("Auth");

@Component
export default class SignUp extends Vue {
  /**********************
   * data fields
   **********************/

  private alertMsg = "";
  private confirmPassword = "";
  private confirmPwdErrorMsgs: string[] = [];
  private email = "";
  private password = "";
  private showConfirmPasswor = false;
  private hasConfirmPwdError = false;
  private showPassword = false;
  private user = "";
  private valid = false;

  private rules = {
    required: ($: string) => !!$ || "Required.",
    username: ($: string) =>
      /^[a-z0-9-_.]+$/.test($) ||
      "It has characters that are not allowed. Allowed characters are: a-z0-9-_.",
    usernameMin: ($: string) =>
      $.length >= 5 ||
      "This value is too short. It should have 5 characters or more.",
    min: ($: string) => $.length >= 8 || "Min 8 characters.",
    emailRules: ($: string) => /.+@.+\..+/.test($) || "E-mail must be valid.",
  };

  @Ref("signUpForm") readonly form!: HTMLFormElement;

  /**********************
   * store actions
   **********************/
  @auth.Action
  public createUser!: (user: CreateUser) => Promise<void>;

  /**********************
   * public functions
   **********************/
  public handleSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.confirmPwdErrorMsgs.push("Passwords don't match.");
      this.hasConfirmPwdError = true;
      return;
    }
    if (this.form.validate()) {
      this.createUser({
        username: this.user,
        email: this.email,
        password: this.password,
      })
        .then(() => this.$router.push({ name: "Login" }))
        .catch((error: Error) => {
          this.alertMsg = error.message;
        });
    }
  }

  public resetConfirmPassword(): void {
    this.hasConfirmPwdError = false;
    this.confirmPwdErrorMsgs = [];
  }
}
</script>

<style lang="scss">
.signin {
  width: 500px;
}
</style>
