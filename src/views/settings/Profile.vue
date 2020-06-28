<template>
  <v-form
    lazy-validation
    v-model="valid"
    ref="signUpForm"
    @submit.prevent="handleSubmit"
  >
    <v-alert v-if="alertMsg" dense outlined type="error">
      {{ alertMsg }}
    </v-alert>
    <v-text-field
      label="Username"
      name="user"
      prepend-icon="mdi-account"
      type="text"
      v-model="getUser.preferredUsername"
      :rules="[rules.required, rules.usernameMin]"
    />
    <v-text-field
      label="E-mail address"
      name="email"
      prepend-icon="mdi-email"
      type="email"
      v-model="getUser.email"
      :rules="[rules.required, rules.emailRules]"
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { User } from "@/model/user";

const userStore = namespace("User");

@Component
export default class Profile extends Vue {
  private valid = false;
  private alertMsg = "";
  private user = "";
  private email = "";

  private rules = {
    required: ($: string) => !!$ || "Required.",
    usernameMin: ($: string) =>
      $.length >= 5 ||
      "This value is too short. It should have 5 characters or more.",
    min: ($: string) => $.length >= 8 || "Min 8 characters.",
    emailRules: ($: string) => /.+@.+\..+/.test($) || "E-mail must be valid.",
  };

  @userStore.Getter
  public getUser!: User;

  public handleSubmit() {
    console.log("submit");
  }
}
</script>

<style lang="scss">
.v-divider {
  color: #333;
  height: 3px;
}
</style>
