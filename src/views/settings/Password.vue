<template>
  <div class="content" no-gutters>
    <h1>
      Password
    </h1>
    <v-divider></v-divider>
    <v-form
      lazy-validation
      v-model="valid"
      ref="passwordForm"
      @submit.prevent="handleSubmit"
    >
      <v-alert v-if="alertMsg" dense outlined type="error">
        {{ alertMsg }}
      </v-alert>
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
        id="new-password"
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
        id="confirm-password"
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
        id="submit"
        type="submit"
        :light="$vuetify.theme.dark && valid"
        :dark="!$vuetify.theme.dark && valid"
        :disabled="!valid"
        >Save</v-btn
      >
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";

@Component
export default class Password extends Vue {
  private valid = false;
  private alertMsg = "";
  private password = "";
  private showPassword = false;
  private newPassword = "";
  private showNewPassword = false;
  private confirmPassword = "";
  private showConfirmPassword = false;
  private confirmPwdErrorMsgs: string[] = [];
  private hasConfirmPwdError = false;

  private rules = {
    required: ($: string) => !!$ || "Required.",
    usernameMin: ($: string) =>
      $.length >= 5 ||
      "This value is too short. It should have 5 characters or more.",
    min: ($: string) => $.length >= 8 || "Min 8 characters.",
    emailRules: ($: string) => /.+@.+\..+/.test($) || "E-mail must be valid.",
  };

  @Ref("passwordForm") readonly form!: HTMLFormElement;

  public handleSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.confirmPwdErrorMsgs.push("Passwords don't match.");
      this.hasConfirmPwdError = true;
      return;
    }

    if (this.form.validate()) {
      console.log("save");
    }
  }
}
</script>

<style lang="scss">
.v-divider {
  color: #333;
  height: 3px;
}
</style>
