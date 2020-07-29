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
      :rules="[rules.usernameMin]"
    />
    <v-text-field
      label="E-mail address"
      name="email"
      prepend-icon="mdi-email"
      type="email"
      v-model="user.email"
      :rules="[rules.required, rules.emailRules]"
    />
    <v-text-field
      label="Registered At"
      prepend-icon="mdi-clock-time-eight-outline"
      :value="user.registeredAt | dateTime"
      disabled
    />
    <v-textarea
      clearable
      label="Summary"
      name="summary"
      rows="2"
      prepend-icon="mdi-card-account-details-outline"
      v-model="user.summary"
    ></v-textarea>
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
import { Component, Vue, Ref } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { User } from "@/model/user";
import { DialogSettings } from "@/model/dialog-settings";

const userStore = namespace("User");
const dialogStore = namespace("Dialog");

@Component
export default class Profile extends Vue {
  public valid = false;
  public user!: User;

  public rules = {
    required: ($: string) => !!$ || "Required.",
    usernameMin: ($: string) =>
      $.length >= 5 ||
      "This value is too short. It should have 5 characters or more.",
    emailRules: ($: string) => /.+@.+\..+/.test($) || "E-mail must be valid.",
  };

  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  @userStore.Getter
  public getUser!: User;

  @userStore.Action
  public updateUser!: (user: User) => Promise<void>;

  @Ref("signUpForm") readonly form!: HTMLFormElement;

  private created() {
    this.user = Object.assign({}, this.getUser);
  }

  public handleSubmit() {
    if (this.form.validate()) {
      this.updateUser(this.user);
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
