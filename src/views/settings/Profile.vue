<template>
  <v-form
    v-if="user"
    lazy-validation
    v-model="valid"
    ref="signUpForm"
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      label="Preferred username"
      name="preferredUsername"
      prepend-icon="mdi-account"
      type="text"
      v-model="user.preferredUsername"
      disabled
    />
    <v-text-field
      label="E-mail address"
      name="email"
      prepend-icon="mdi-email"
      type="email"
      v-model="user.email"
      :rules="[rules.emailRules]"
    />
    <v-textarea
      clearable
      label="Summary"
      name="summary"
      rows="2"
      prepend-icon="mdi-card-account-details-outline"
      v-model="user.summary"
      disabled
    ></v-textarea>
    <v-text-field
      v-if="user.published"
      label="Registered At"
      name="registered_at"
      prepend-icon="mdi-account-plus"
      :value="user.published | dateTime"
      disabled
    />
    <v-text-field
      v-if="user.updated"
      label="Updated At"
      name="updated_at"
      prepend-icon="mdi-account-edit"
      :value="user.updated | dateTime"
      disabled
    />
    <v-text-field
      label="New Password"
      name="newPassword"
      prepend-icon="mdi-lock"
      v-model="newPassword"
      :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showNewPassword ? 'text' : 'password'"
      @click:append="showNewPassword = !showNewPassword"
    />
    <v-text-field
      label="Confirm password"
      name="confirmPassword"
      prepend-icon="mdi-lock-check"
      v-model="confirmPassword"
      :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showConfirmPassword ? 'text' : 'password'"
      :error="hasConfirmPwdError"
      :error-messages="confirmPwdErrorMsgs"
      @input="resetConfirmPassword()"
      @click:append="showConfirmPassword = !showConfirmPassword"
    />
    <v-text-field
      label="Password"
      name="password"
      prepend-icon="mdi-lock"
      v-model="password"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      :rules="[rules.required]"
      @click:append="showPassword = !showPassword"
      @input="resetConfirmPassword()"
    />
    <v-btn
      id="submit"
      type="submit"
      :light="$vuetify.theme.dark && valid"
      :dark="!$vuetify.theme.dark && valid"
      :disabled="!valid"
      >Save</v-btn
    >
    <v-btn
      id="close-btn"
      class="ma-1"
      :light="$vuetify.theme.dark"
      :dark="!$vuetify.theme.dark"
      @click="toggleDialog({ title: undefined, components: undefined })"
      >Close</v-btn
    >
  </v-form>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { DialogSettings } from "@/model/dialog-settings";
import { InternalActor } from "@/model/internal-actor";
import { UpdateProfile } from "@/model/update-profile";

const dialogStore = namespace("Dialog");
const userStore = namespace("User");

@Component
export default class Profile extends Vue {
  /**********************
   * data fields
   **********************/
  public user!: InternalActor;
  public confirmPassword = "";
  public confirmPwdErrorMsgs: string[] = [];
  public hasConfirmPwdError = false;
  public newPassword = "";
  public password = "";
  public showConfirmPassword = false;
  public showNewPassword = false;
  public showPassword = false;

  public valid = false;

  public rules = {
    required: ($: string) => !!$ || "Required.",
    min: ($: string) => $.length < 1 || $.length >= 8 || "Min 8 characters.",
    emailRules: ($: string) =>
      $.length < 1 || /.+@.+\..+/.test($) || "E-mail must be valid.",
  };

  @Ref("signUpForm") readonly form!: HTMLFormElement;

  /**********************
   * store getters
   **********************/
  @userStore.Getter
  public getUser!: InternalActor;

  /**********************
   * store actions
   **********************/
  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  @userStore.Action
  public updateProfile!: (profile: UpdateProfile) => Promise<void>;

  /**********************
   * Lifecycle hooks
   **********************/
  private created(): void {
    this.user = Object.assign({}, this.getUser);
  }

  /**********************
   * public functions
   **********************/
  public handleSubmit(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.confirmPwdErrorMsgs.push("Passwords don't match.");
      this.hasConfirmPwdError = true;
      return;
    }

    if (this.form.validate()) {
      let updateProfile: UpdateProfile = {
        currentPassword: this.password,
      };

      if (this.user.email && this.user.email !== this.getUser.email) {
        updateProfile = Object.assign(
          { email: this.user.email },
          updateProfile
        );
      }

      if (this.newPassword) {
        updateProfile = Object.assign(
          { newPassword: this.newPassword },
          updateProfile
        );
      }
      this.updateProfile(updateProfile);
    }
  }

  public resetConfirmPassword(): void {
    this.hasConfirmPwdError = false;
    this.confirmPwdErrorMsgs = [];
  }
}
</script>

<style lang="scss">
.v-divider {
  color: #333;
  height: 3px;
}
</style>
