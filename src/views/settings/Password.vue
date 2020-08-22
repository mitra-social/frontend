<template>
  <v-form
    lazy-validation
    v-model="valid"
    ref="passwordForm"
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      label="Password"
      name="password"
      prepend-icon="mdi-lock"
      v-model="password"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      :rules="[rules.required]"
      @click:append="showPassword = !showPassword"
    />
    <v-text-field
      label="New Password"
      name="newPassword"
      prepend-icon="mdi-lock"
      v-model="newPassword"
      :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showNewPassword ? 'text' : 'password'"
      :rules="[rules.required, rules.min]"
      @click:append="showNewPassword = !showNewPassword"
    />
    <v-text-field
      label="Confirm password"
      name="confirmPassword"
      prepend-icon="mdi-lock-check"
      v-model="confirmPassword"
      :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showConfirmPassword ? 'text' : 'password'"
      :rules="[rules.required]"
      :error="hasConfirmPwdError"
      :error-messages="confirmPwdErrorMsgs"
      @input="resetConfirmPassword()"
      @click:append="showConfirmPassword = !showConfirmPassword"
    />
    <v-btn
      id="save-btn"
      type="submit"
      class="ma-1"
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
import { Component, Vue, Ref } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { PasswordChangeParam } from "../../model/password-change-param";
import { DialogSettings } from "../../model/dialog-settings";

const userStore = namespace("User");
const dialogStore = namespace("Dialog");

@Component
export default class Password extends Vue {
  public valid = false;
  public password = "";
  public showPassword = false;
  public newPassword = "";
  public showNewPassword = false;
  public confirmPassword = "";
  public showConfirmPassword = false;
  public confirmPwdErrorMsgs: string[] = [];
  public hasConfirmPwdError = false;

  public rules = {
    required: ($: string) => !!$ || "Required.",
    usernameMin: ($: string) =>
      $.length >= 5 ||
      "This value is too short. It should have 5 characters or more.",
    min: ($: string) => $.length >= 8 || "Min 8 characters.",
  };

  @userStore.Action
  public updatePassword!: (passwordChangeParam: PasswordChangeParam) => void;

  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  @Ref("passwordForm") readonly form!: HTMLFormElement;

  public handleSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.confirmPwdErrorMsgs.push("Passwords don't match.");
      this.hasConfirmPwdError = true;
      return;
    }

    if (this.form.validate()) {
      this.updatePassword({
        oldPassword: this.password,
        newPassword: this.newPassword,
      });
    }
  }

  public resetConfirmPassword() {
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
