<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar
          :light="$vuetify.theme.dark"
          :dark="!$vuetify.theme.dark"
          flat
        >
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-alert v-if="authStatus === 'error'" dense outlined type="error">
              The user name or password you entered isn't correct. Try entering
              it again.
            </v-alert>
            <v-text-field
              label="Login"
              name="login"
              prepend-icon="mdi-account"
              type="text"
              v-model="user"
            />
            <v-text-field
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text x-small link :to="{ name: 'signup' }">
            You don't have an account? To sign up!
          </v-btn>
          <v-spacer />
          <v-btn
            :light="$vuetify.theme.dark"
            :dark="!$vuetify.theme.dark"
            @click="handleSubmit"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Credential } from "@/model/credential";

const auth = namespace("Auth");

@Component
export default class Login extends Vue {
  private user = "";
  private password = "";

  @auth.Getter
  public authStatus!: string;

  @auth.Action
  public login!: (credential: Credential) => void;

  public handleSubmit() {
    this.login({ username: this.user, password: this.password });
  }
}
</script>

<style lang="scss">
.signin {
  width: 500px;
}
</style>
